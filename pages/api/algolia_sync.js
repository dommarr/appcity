import { createClient } from '@supabase/supabase-js'
import algoliasearch from 'algoliasearch'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const algoliaApp = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const algoliaKey = process.env.ALGOLIA_ADMIN_KEY
const algolia = algoliasearch(algoliaApp, algoliaKey)
const index = algolia.initIndex('catalog')

export default async function(req, res) {
    
    // query data from Supabase
    let { data, error } = await supabase
        .from('tiers')
        .select(`
            *,
            products (
                *,
                vendors (
                    *
                )
            )
            )
        `)

    if (error) {
        res.statusCode = 500
        res.json(error)
    } else {

        const objects = []

        // organize data for Algolia
        data.forEach(function(elem) {
            const obj = {}
            obj.objectID = elem.id
            obj.tier = elem.name
            obj.product = elem.products.name
            obj.vendor = elem.products.vendors.name
            obj.keywords = elem.products.keywords
            obj.vendor_website = elem.products.vendors.website
            obj.logo = elem.products.vendors.logo
            elem.price_other_pay_monthly ? obj.price_pay_monthly = elem.price_other_pay_monthly : obj.price_pay_monthly = elem.price_pay_monthly
            elem.price_other_pay_yearly ? obj.price_pay_yearly = elem.price_other_pay_yearly : obj.price_pay_yearly = elem.price_pay_yearly
            obj.sort_price_monthly = elem.price_pay_monthly
            obj.sort_price_yearly = elem.price_pay_yearly
            obj.price_unit = elem.price_unit
            objects.push(obj)
        })

        // save to Algolia
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
}
      



