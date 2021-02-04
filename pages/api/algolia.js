import { createClient } from '@supabase/supabase-js'
import algoliasearch from 'algoliasearch'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY
const algolia = algoliasearch(algoliaApp, algoliaKey)
const index = algolia.initIndex('catalog')

async function getCategories() {
    try {
        let response = await supabase
            .from('categories')
            .select('*')
        return response.data
    } catch(err) {
        alert(err)
    }
}

async function getCatalog() {
    try {
        let response = await supabase
        .from('tiers')
        .select(`
            *,
            products (
                *,
                vendors (
                    *
                ),
                products_categories (
                    *
                )
            )
            )
        `)
        return response.data
    } catch(err) {
        alert(err)
    }
}

const createCatTable = (cats, arr) => {
    const categories = []
    let i
    // for each category, create a new object
    for (i = 0; i < arr.length; i++) {
        const obj = {}
        // set default values (assumes top-level category, defined as parent_id === null)
        obj.id = arr[i].id
        obj.lvl = 0
        obj.name = arr[i].name
        let current_parent = arr[i].parent_id
        // if parent_id is not null, it is not a top-level category, so update lvl and name
        // continue until we have gone up the chain to the top-level (parent_id === null)
        while (current_parent !== null) {
            obj.lvl++
            obj.name = cats[current_parent] + ' > ' + obj.name
            let j
            for (j = 0; j < arr.length; j++) {
                if (arr[j].id === current_parent) {
                    current_parent = arr[j].parent_id
                }
            }
        }
        categories.push(obj)
    }
    return categories
}


export default async function(req, res) {

    // get category data and build out hierarchy (categories and sub-categories)
    const catArray = await getCategories()
    const catNames = {}
    catArray.forEach(elem => catNames[elem.id] = elem.name)
    const categories = createCatTable(catNames, catArray)
    
    // query data from Supabase
    const catalog = await getCatalog()

    // array for algolia index
    const objects = []

    // organize data for Algolia
    catalog.forEach(function(elem) {
        const obj = {}
        obj.objectID = elem.id
        obj.tier = elem.name
        obj.product = elem.products.name
        obj.vendor = elem.products.vendors.name
        obj.keywords = elem.products.keywords
        obj.vendor_website = elem.products.vendors.website
        obj.logo = elem.products.vendors.logo
        elem.price_other_pay_monthly ? obj.price_pay_monthly = elem.price_other_pay_monthly : obj.price_pay_monthly = `$${elem.price_pay_monthly}`
        elem.price_other_pay_yearly ? obj.price_pay_yearly = elem.price_other_pay_yearly : obj.price_pay_yearly = `$${elem.price_pay_yearly}`
        obj.sort_price_monthly = elem.price_pay_monthly
        obj.sort_price_yearly = elem.price_pay_yearly
        obj.price_unit = elem.price_unit
        obj.price_note = elem.price_note
        obj.starting_price_monthly = elem.starting_price_pay_monthly
        obj.starting_price_yearly = elem.starting_price_pay_yearly
        obj.starting_price_unit = elem.starting_price_unit
        obj.starting_price_note = elem.starting_price_note
        obj.categories = {}
        // for each category, match and get the hierarchy level and name
        elem.products.products_categories.forEach(function(item){
            let match = categories.filter(function(entry) {return entry.id === item.category_id})
            let level = 'lvl' + match[0].lvl
            obj.categories[level] = match[0].name
        })
        objects.push(obj)
    })

    //save to Algolia
    return new Promise((resolve, reject) => {
        index.saveObjects(objects)
            .then(({ objectIDs }) => {
                res.statusCode = 200
                res.json(objectIDs)
                resolve()
            })
            .catch(error => {
                res.statusCode = 500
                res.json(error)
                return resolve()
            }) 
    })
    
}
      



