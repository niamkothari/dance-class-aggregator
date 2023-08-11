import { MongoClient } from 'mongodb'
import { Administrator, Studio, Instructor, Class } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const admins: Administrator[] = [
    {
        _id: 'nemo',
        name: 'Niam Kothari',
        email: 'nkothari523@gmail.com'
    }
]

const seedInstructors: Instructor[] = [
    {_id: '2', name: 'Sam Javi'},
    {_id: '4', name: 'Huu Rock'},
    { _id: '5', name: 'Kenichi Kasamatsu'},
    {_id: '13', name: 'Sheila Barker'},
    {_id: '15', name: 'Brandon Trent'},
    {_id: '17', name: 'Julian DeGuzman'}
]

const seedStudios: Studio[] = [
    {_id: '1', name: 'Brickhouse', address: '156 W 44th Street 3rd Floor, New York, NY 10036'},
    {_id: '6', name: 'Broadway Dance Center', address: 'Manhattan'},
    {_id: '7', name: 'Peridance Center', address: 'SoHo'},
    {_id: '8', name: 'Movers Bodega', address: 'Queens'}
]

const seedClasses: Class[] = [
    {
        _id: '3', 
        name: 'Int/Adv Choreography', 
        instructor: seedInstructors[0], 
        studio: seedStudios[0],
        style: "Choreography", 
        day: "Friday", 
        time: 1830
    },
    {
        _id: '9',
        name: 'Beginner House',
        instructor: seedInstructors[1],
        studio: seedStudios[1],
        style: "House",
        day: "Tuesday",
        time: 1130
    },
    {
        _id: '10',
        name: 'Int/Adv House',
        instructor: seedInstructors[1],
        studio: seedStudios[3],
        style: 'House',
        day: 'Tuesday',
        time: 2000
    },
    {
        _id: '11',
        name: 'Int/Adv Street Jazz',
        instructor: seedInstructors[2],
        studio: seedStudios[1],
        style: 'Street jazz',
        day: 'Monday',
        time: 1745
    },
    {
        _id: '12',
        name: 'Adv Choreography',
        instructor: seedInstructors[2],
        studio: seedStudios[2],
        style: 'Choreography',
        day: 'Tuesday',
        time: 1900
    },
    {
        _id: '14',
        name: 'Adv Beg Jazz',
        instructor: seedInstructors[3],
        studio: seedStudios[1],
        style: 'Jazz',
        day: 'Wednesday',
        time: 1330
    },
    {
        _id: '16',
        name: 'Adv Choreography',
        instructor: seedInstructors[4],
        studio: seedStudios[0],
        style: 'Choreography',
        day: 'Friday',
        time: 2000
    },
    {
        _id: '18',
        name: 'Pop Up',
        instructor: seedInstructors[5],
        studio: seedStudios[0],
        style: 'Choreography',
        day: 'Wednesday',
        time: 1800
    }
]

async function main() {
    await client.connect()
    console.log("Successfully connected to MongoDB database")

    const db = client.db("danceClassAggregatorDB")
    console.log("Setting up admins", await db.collection("admins").insertMany(admins as any))
    console.log("Setting up instructors", await db.collection("Instructors").insertMany(seedInstructors as any))
    console.log("Setting up studios", await db.collection("Studios").insertMany(seedStudios as any))
    console.log("Setting up classes", await db.collection("Classes").insertMany(seedClasses as any))

    console.log("Seed data inserted successfully\n")

    process.exit(0)
}

main()