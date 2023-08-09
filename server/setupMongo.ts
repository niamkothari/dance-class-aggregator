import { MongoClient } from 'mongodb'
import { Administrator } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const admins: Administrator[] = [
    {
        _id: 'nemo',
        name: 'Niam Kothari',
        email: 'nkothari523@gmail.com'
    }
]

async function main() {
    await client.connect()
    console.log("Successfully connected to MongoDB database")

    const db = client.db("danceClassAggregatorDB")
    console.log("Setting up admins", await db.collection("admins").insertMany(admins as any))

    process.exit(0)
}

main()