import sanityClient from "@sanity/client"
import dotenv from "dotenv"

dotenv.config()

export default sanityClient({
    projectId: "15rplgir",
    dataset: "production",
    useCdn: false,
    apiVersion: "2022-03-03",
    token: process.env.SANITY_API_TOKEN,
})