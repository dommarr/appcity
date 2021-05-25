import { useState, useEffect } from "react";
import { supabase } from "../../utils/initSupabase";
import Loading from "./cardLoading";

export default function CategoryForm({ productId }) {
  // form loading
  const [loading, setLoading] = useState(true);
  // form submission states
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState();
  const [message, setMessage] = useState();
  // category data
  const [allCategories, setAllCategories] = useState();
  const [categoryGroups, setCategoryGroups] = useState();
  // form fields
  const [displayCategories, setDisplayCategories] = useState([]);
  const [categoryState, setCategoryState] = useState([{}]);
  const [beginCategories, setBeginCategories] = useState();

  // Fetch on load
  useEffect(() => {
    // get category data and build out hierarchy (categories and sub-categories)
    const fetchCategories = async () => {
      // get all categories
      const catArray = await getCategories();
      // get categories for current product
      const productCats = await getProductCategories(productId);
      const catNames = {};
      catArray.forEach((elem) => (catNames[elem.id] = elem.name));
      // create category hierarchy
      const categories = createCatTable(catNames, catArray);
      setAllCategories(categories);
      // create category groups (based on sharing the top-level parent)
      let groups = [];
      categories.forEach((elem) => groups.push(elem.group));
      groups = [...new Set(groups)];
      setCategoryGroups(groups);
      // set initial state of current categories for the current product
      let initialCategoryState = {};
      categories.forEach((elem) => Object.assign(initialCategoryState, { [elem.id]: false }));
      productCats.forEach((elem) => Object.assign(initialCategoryState, { [elem.category_id]: true }));
      setCategoryState([initialCategoryState]);
      let beginCat = [];
      productCats.forEach((elem) => beginCat.push(elem.category_id.toString()));
      setBeginCategories(beginCat);
      // filter allCategories to only the selected category for the product and as display
      let filtered = [];
      productCats.forEach((elem) => filtered.push(elem.category_id.toString()));
      let selectedCategories = categories.filter((cat) => filtered.includes(cat.id.toString()));
      setDisplayCategories(selectedCategories);
    };
    fetchCategories();
    setLoading(false);
  }, []);

  // categories
  const createCatTable = (cats, arr) => {
    const categories = [];
    let i;
    // for each category, create a new object
    for (i = 0; i < arr.length; i++) {
      const obj = {};
      // set default values (assumes top-level category, defined as parent_id === null)
      obj.id = arr[i].id;
      obj.group = arr[i].id;
      obj.lvl = 0;
      obj.name = arr[i].name;
      obj.nesting = arr[i].name;
      let current_parent = arr[i].parent_id;
      // if parent_id is not null, it is not a top-level category, so update lvl and name
      // continue until we have gone up the chain to the top-level (parent_id === null)
      while (current_parent !== null) {
        obj.lvl++;
        obj.nesting = cats[current_parent] + " > " + obj.nesting;
        obj.group = current_parent;
        let j;
        for (j = 0; j < arr.length; j++) {
          if (arr[j].id === current_parent) {
            current_parent = arr[j].parent_id;
          }
        }
      }
      categories.push(obj);
    }
    return categories;
  };

  async function getCategories() {
    let { data: categories, error } = await supabase.from("categories").select("*");
    if (error) {
      throw error;
    }
    return categories;
  }

  async function getProductCategories(product_id) {
    let { data: products_categories, error } = await supabase.from("products_categories").select("*").eq("product_id", product_id);
    if (error) {
      throw error;
    }
    return products_categories;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    // determine what categories were added or removed
    let keys = Object.keys(categoryState[0]);
    let endCategories = keys.filter(function (key) {
      return categoryState[0][key];
    });
    let added = endCategories.filter((cat) => !beginCategories.includes(cat));
    let removed = beginCategories.filter((cat) => !endCategories.includes(cat));
    // create arrays for insert and delete
    let insert = [];
    added.forEach((elem) => insert.push({ product_id: productId, category_id: parseInt(elem) }));
    let deleteArr = [];
    removed.forEach((elem) => deleteArr.push(parseInt(elem)));
    // insert added categories
    if (insert.length) {
      const { data, error } = await supabase.from("products_categories").insert(insert);
      if (error) {
        handleFailure();
        throw error;
      }
      if (data) {
        handleSuccess();
      }
    }
    // delete removed categories
    if (deleteArr.length) {
      const { data, error } = await supabase.from("products_categories").delete().eq("product_id", productId).in("category_id", deleteArr);
      if (error) {
        handleFailure();
        throw error;
      }
      if (data) {
        handleSuccess();
      }
    }
    setUpdating(false);
  };

  const handleCheckboxClick = (e) => {
    const check = e.target.checked;
    const name = e.target.name;
    let updatedCategoryState = Object.assign(categoryState[0], { [name]: check });
    setCategoryState([updatedCategoryState]);
    let keys = Object.keys(updatedCategoryState);
    let filtered = keys.filter(function (key) {
      return updatedCategoryState[key];
    });
    let selectedCategories = allCategories.filter((cat) => filtered.includes(cat.id.toString()));
    setDisplayCategories(selectedCategories);
  };

  const handleSuccess = () => {
    setUpdating(false);
    setSuccess(true);
    setMessage("Saved successfully.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  const handleFailure = () => {
    setUpdating(false);
    setSuccess(false);
    setMessage("There was an error. Please try again.");
    setTimeout(function () {
      setMessage("");
    }, 4000);
  };

  if (loading) return <Loading />;

  return (
    <div className="shadow sm:overflow-hidden">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="bg-white py-6 px-4 sm:p-6">
          <div className="flex flex-col space-y-2">
            <h2 id="app-details-heading" className="text-lg leading-6 font-medium text-gray-900">
              App categories
            </h2>
            <div className="p-1">
              <div className="text-sm">Selected:</div>
              <div className="border p-1">
                {/* <div>{categoryState}</div> */}
                <ul>
                  {displayCategories.length < 1 && <li className="text-sm">No categories selected</li>}
                  {displayCategories.length > 0 &&
                    displayCategories.map((val, idx) => {
                      return (
                        <li key={idx} className="text-sm">
                          {val.nesting}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {categoryGroups &&
              categoryGroups.map((val, idx) => {
                let match = allCategories.filter((obj) => obj.group === val);
                return (
                  <div key={idx} className={`grid grid-cols-4 gap-1 p-2 ${idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                    {match.map((obj, idx) => {
                      if (obj.lvl === 0) {
                        return (
                          <div key={idx} className="col-span-1 col-start-1 flex items-center justify-start space-x-1">
                            <input type="checkbox" id={obj.id} checked={categoryState[0][obj.id]} value={categoryState[0][obj.id]} name={obj.id} onChange={handleCheckboxClick} />
                            <label htmlFor={obj.id}>{obj.name}</label>
                          </div>
                        );
                      }
                      if (obj.lvl === 1) {
                        return (
                          <div key={idx} className="col-span-1 col-start-2 flex items-center justify-start space-x-1">
                            <input type="checkbox" id={obj.id} checked={categoryState[0][obj.id]} value={categoryState[0][obj.id]} name={obj.id} onChange={handleCheckboxClick} />
                            <label htmlFor={obj.id}>{obj.name}</label>
                          </div>
                        );
                      }
                      if (obj.lvl === 2) {
                        return (
                          <div key={idx} className="col-span-1 col-start-3 flex items-center justify-start space-x-1">
                            <input type="checkbox" id={obj.id} checked={categoryState[0][obj.id]} value={categoryState[0][obj.id]} name={obj.id} onChange={handleCheckboxClick} />
                            <label htmlFor={obj.id}>{obj.name}</label>
                          </div>
                        );
                      }
                      if (obj.lvl === 3) {
                        return (
                          <div key={idx} className="col-span-1 col-start-4 flex items-center justify-start space-x-1">
                            <input type="checkbox" id={obj.id} checked={categoryState[0][obj.id]} value={categoryState[0][obj.id]} name={obj.id} onChange={handleCheckboxClick} />
                            <label htmlFor={obj.id}>{obj.name}</label>
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex px-4 py-3 bg-gray-50 text-right sm:px-6">
          {!updating && (
            <button
              type="submit"
              className="bg-purple border border-transparent shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-extradark focus:outline-none focus:ring-0"
            >
              Save
            </button>
          )}
          {updating && (
            <button className="bg-purple border border-transparent shadow-sm inline-flex py-1.5 px-5 justify-center items-center text-sm font-medium text-white focus:outline-none focus:ring-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          )}
          <div className={`flex items-center ml-4 ${success ? `text-green-600` : `text-red-600`}`}>{message}</div>
        </div>
      </form>
    </div>
  );
}
