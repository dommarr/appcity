import { supabase } from "../../utils/initSupabase";

const fetchVendors = async () => {
  let { data: vendors, error } = await supabase.from("vendors").select("*");
  if (error) {
    throw error;
  }
  return vendors;
};

const fetchProducts = async () => {
  let { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    throw error;
  }
  return products;
};

const fetchTiers = async () => {
  let { data: tiers, error } = await supabase
    .from("tiers")
    .select(
      "product_id,name,number,features,display_features,price_primary_number_month,price_primary_text_month,price_primary_number_year,price_primary_text_year,price_primary_unit_month,price_primary_unit_year"
    );
  if (error) {
    throw error;
  }
  return tiers;
};

const fetchProductCategories = async () => {
  let { data: products_categories, error } = await supabase.from("products_categories").select("*");
  if (error) {
    throw error;
  }
  return products_categories;
};

const emptyFields = (obj) => {
  let empty = [];
  for (var key in obj) {
    if (!obj[key]) {
      empty.push(key);
    }
  }
  empty = empty.filter((elem) => !elem.startsWith("tierCount"));
  return empty;
};

const emptyTiers = (obj) => {
  let empty = [];
  for (var key in obj) {
    if (obj[key] === 0) {
    } else if (!obj[key]) {
      empty.push(key);
    }
    if (obj[key] instanceof Array) {
      if (obj[key].length === 0) {
        empty.push(key);
      }
    }
  }

  // month - both number and text are empty
  if (empty.includes("price_primary_number_month") && empty.includes("price_primary_text_month")) {
    empty.push("price_month needs number or text");
    // month - both number and text are populated
  } else if (!empty.includes("price_primary_number_month") && !empty.includes("price_primary_text_month")) {
    empty.push("price_month contains both number and text");
  } // year - both number and text are empty
  if (empty.includes("price_primary_number_year") && empty.includes("price_primary_text_year")) {
    empty.push("price_year needs number or text");
    // year - both number and text are empty
  } else if (!empty.includes("price_primary_number_year") && !empty.includes("price_primary_text_year")) {
    empty.push("price_year contains both number and text");
  }

  // month - unit is empty, but shouldn't
  if (empty.includes("price_primary_unit_month") && empty.includes("price_primary_text_month") && !empty.includes("price_primary_number_month")) {
    empty.push("price_unit_month should be populated");
    // month - unit is populated, but shouldn't
  } else if (!empty.includes("price_primary_unit_month") && !empty.includes("price_primary_text_month") && empty.includes("price_primary_number_month")) {
    empty.push("price_unit_month should not be populated");
  }
  // year - unit is empty, but shouldn't
  if (empty.includes("price_primary_unit_year") && empty.includes("price_primary_text_year") && !empty.includes("price_primary_number_year")) {
    empty.push("price_unit_year should be populated");
    // month - unit is populated, but shouldn't
  } else if (!empty.includes("price_primary_unit_year") && !empty.includes("price_primary_text_year") && empty.includes("price_primary_number_year")) {
    empty.push("price_unit_year should not be populated");
  }

  empty = empty.filter((elem) => !elem.startsWith("price_primary"));
  empty = empty.map((e) => `tier_${obj.number}_${e}`);

  return empty;
};

const fetchTasks = async () => {
  const { data: tasks, error } = await supabase.from("tasks").select("product_id").eq("name", "Missing Data").eq("complete", false);
  if (error) {
    throw error;
  }
  return tasks;
};

// existing tasks to update // update task keep product_complete false
const updateExistingTasks = async (obj) => {
  const { data, error } = await supabase.from("tasks").update(obj).eq("product_id", obj.product_id).eq("name", obj.name);
  if (error) {
    throw error;
  }
  if (data) {
    const { data, error } = await supabase.from("products").update({ complete: false }).eq("id", obj.product_id);
    if (error) {
      throw error;
    }
    return data;
  }
};

// new tasks to create // create task, flip product_complete false
const createNewTasks = async (obj) => {
  const { data, error } = await supabase.from("tasks").insert([obj]);
  if (error) {
    throw error;
  }
  if (data) {
    const { data, error } = await supabase.from("products").update({ complete: false }).eq("id", obj.product_id);
    if (error) {
      throw error;
    }
    return data;
  }
};

// tasks no longer relevant // flip task_complete true, flip product_complete true
const updateDoneTasks = async (id) => {
  const { data, error } = await supabase.from("tasks").update({ complete: true }).eq("product_id", id).eq("name", "Missing Data");
  if (error) {
    throw error;
  }
  if (data) {
    const { data, error } = await supabase.from("products").update({ complete: true }).eq("id", id);
    if (error) {
      throw error;
    }
    return data;
  }
};

// complete data // flip product_complete true
const updateCompleteProducts = async (id) => {
  const { data, error } = await supabase.from("products").update({ complete: true }).eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export default async function (req, res) {
  const vendors = await fetchVendors();
  const products = await fetchProducts();
  const tiers = await fetchTiers();
  const products_categories = await fetchProductCategories();

  let apps = [];

  products.forEach((elem) => {
    let appObj = {};
    // filter vendors, tiers, and categories to current element
    let currentVendor = vendors.filter((ven) => ven.id === elem.vendor_id);
    let currentTiers = tiers.filter((tier) => tier.product_id === elem.id);
    let currentCategories = products_categories.filter((cat) => cat.product_id === elem.id);
    // vendor data
    appObj.company_name = currentVendor[0].name;
    appObj.company_website = currentVendor[0].website;
    appObj.company_logo = currentVendor[0].logo;
    //product data
    appObj.product_id = elem.id;
    appObj.product_name = elem.name;
    appObj.price_link = elem.price_link;
    appObj.price_model = elem.price_model;
    appObj.keywords = elem.keywords;
    appObj.media = elem.media ? elem.media.length : null;
    // category data
    appObj.category = currentCategories ? currentCategories.length : null;
    // tier data
    appObj.tierCount = currentTiers ? currentTiers.length : null;
    appObj.tiers = currentTiers;
    apps.push(appObj);
  });

  let tasks = [];
  let completeData = [];

  apps.forEach((elem) => {
    let missingProductData = emptyFields(elem);
    let missingTierData = [];
    elem.tiers.forEach((tier) => {
      let empty = emptyTiers(tier);
      missingTierData = missingTierData.concat(empty);
    });
    let missingData = missingProductData.concat(missingTierData);
    if (elem.tierCount === 0) {
      missingData.push("no tiers");
    }

    if (missingData.length > 0) {
      let taskObj = {
        name: "Missing Data",
        product_id: elem.product_id,
        product_name: elem.product_name,
        notes: missingData,
      };
      tasks.push(taskObj);
    } else {
      completeData.push(elem.product_id);
    }
  });

  let existingTasks = await fetchTasks();
  existingTasks = existingTasks.map((obj) => obj.product_id);

  // existing tasks to update // update task keep product_complete false
  let existing = tasks.filter((elem) => existingTasks.includes(elem.product_id));
  // new tasks to create // create task, flip product_complete false
  let newTasks = tasks.filter((elem) => !existingTasks.includes(elem.product_id));
  // tasks no longer relevant // flip task_complete true, flip product_complete true
  let doneTasks = existingTasks.filter((elem) => completeData.includes(elem));

  let response = [];

  for (let i = 0; i < existing.length; i++) {
    let updatedTasksData = await updateExistingTasks(existing[i]);
    response.push(updatedTasksData);
  }

  for (let i = 0; i < newTasks.length; i++) {
    let createdTasksData = await createNewTasks(newTasks[i]);
    response.push(createdTasksData);
  }

  for (let i = 0; i < doneTasks.length; i++) {
    let doneTasksData = await updateDoneTasks(doneTasks[i]);
    response.push(doneTasksData);
  }

  for (let i = 0; i < completeData.length; i++) {
    let completeProductsData = await updateCompleteProducts(completeData[i]);
    response.push(completeProductsData);
  }

  res.statusCode = 200;
  res.json(response);
}
