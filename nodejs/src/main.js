import {
    MongoClient,
    ServerApiVersion
} from 'mongodb'

import * as readline from 'node:readline/promises';
import {stdin, stdout} from 'node:process'

const uri = process.env.MONGO_URI

let mongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const run = async () => {
    try {
        await mongoClient.connect()
    } finally {
        //await mongoClient.close()
    }
    let hola = await mongoClient.db().admin().listDatabases();
    hola.databases.forEach(e => console.log("-> " + e.name))

    const rl = readline.createInterface(stdin, stdout) 
    let chosenDB = await rl.question(">>> ")

    let DB = mongoClient.db(chosenDB);

    let collectionList = await DB.listCollections({}, {}).toArray()
    collectionList.forEach(e => console.log("-> " + e.name))
    
    let chosenCollection = await rl.question(">>> ")

    let collection = DB.collection(chosenCollection).find({})
    console.log(await collection.toArray())
}

run().catch(console.log)

