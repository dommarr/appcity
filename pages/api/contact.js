import Cors from 'cors'
import initMiddleware from '../../utils/initMiddleware'
let postmark = require("postmark")
const serverToken = process.env.NEXT_PUBLIC_POSTMARK_KEY;
let client = new postmark.ServerClient(serverToken);

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function handler(req, res) {
  // Run cors
  await cors(req, res)
  let response = await client.sendEmail(req.body)
  // Rest of the API logic
  res.json(response)
}