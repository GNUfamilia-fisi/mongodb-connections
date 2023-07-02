import {
    MongoClient,
    ObjectId,
    ServerApiVersion
} from 'mongodb'

import {createServer} from 'node:http'

//NOTE: this place has to handle all client requests

const queryEditable = class {
    constructor(title, description, thumbnail) {
        this.title = title,
        this.description = description,
        this.thumbnail = thumbnail
    }
}

const dataTemplate = class extends queryEditable {
    constructor(_id) {
        super()
        this._id = _id
    }
}

const deletefromDatabase = async (queryDoc) => {
    const handle = mongoClient.db("hola").collection("hola")
    return (await handle.deleteMany(queryDoc))
}

const insertAtDatabase = async (obj) => {
    const handle = mongoClient.db("hola").collection("hola")
    return (await handle.insertOne(obj))
}

const updateFromDatabase = async (filter, newValues) => {
    const handler = mongoClient.db("hola").collection("hola")
    return (await handler.updateMany(filter, newValues))
}

const Create = (request, response) => {
    let body = []
    let newVideo = new dataTemplate()

    request
    .on("data", (chunk) => {
        body.push(chunk)
    })
    .on("end", () => {
        const newBody = Buffer.concat(body).toString()
        const jsonVideo = JSON.parse(newBody)

        newVideo.title = jsonVideo.title
        newVideo.description = jsonVideo.description
        newVideo.thumbnail = jsonVideo.thumbnail

        insertAtDatabase(JSON.parse(newBody)).then(e => {
            console.log("hola papu")
            newVideo._id = e.insertedId.toString()

            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS, PUT",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json"
            });
            response.end(JSON.stringify(newVideo));
        })
    })
}

const Read = (response, id) => {
    let list = []

    console.log(id)
    run().then(e => {
        let newVideo = new dataTemplate()

        if (id) {
            e.forEach((elem) => {
                newVideo.title = elem.title,
                newVideo.description = elem.description,
                newVideo.thumbnail = elem.thumbnail
                newVideo._id = elem._id

                if (id[1] === elem._id.toString()) {
                    list = elem
                }
            })
        }

        else {
            e.forEach((elem) => {
                newVideo.title = elem.title,
                newVideo.description = elem.description,
                newVideo.thumbnail = elem.thumbnail
                newVideo._id = elem._id

                list.push(elem)
            })
        }

        console.log("hola papu")

        // response.setHeader("Content-type", "application/json")
        // response.setHeader("Access-Control-Allow-Origin", "*")
        // response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        // response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        // response.setHeader()
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS, PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json"
        })
        response.end(JSON.stringify(list))
    })
}

const Update = (request, response, id) => {
    let body = []

    let query = {  }

    let filter = {
        _id: new ObjectId(id[1])
    }

    request
    .on("data", (chunk) => {
        body.push(chunk)
    })
    .on("end", () => {
        body = Buffer.concat(body).toString()
        query.$set = JSON.parse(body)
        console.log(query)
        updateFromDatabase(filter, query).then(e => {
            console.log(e)
        })
    })
    response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json"
    });
    response.end();
}

const Delete = async (response, id) => {
    if (!id) throw new Error("'id' field cannot be undefined")
    const query = {
        _id: new ObjectId(id[1])
    }

    console.log(query)

    const delete_result = await deletefromDatabase(query);
    console.log({ delete_result });
    response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json"
    });
    response.end();
}

const mainHandler = (request, response) => {
    if (request.method === "GET") {
        if (request.url === "/api/videos") {
            Read(response)
        }
        if (/\/api\/videos\/(\w+)/.test(request.url)) {
            Read(response, /\/api\/videos\/(\w+)/.exec(request.url))
        }
    }
    else if (request.method === "POST") {
        if (request.url === "/api/upload") {
            Create(request, response)
        }
    }
    else if (request.method === "DELETE") {
        if (/\/api\/delete\/(\w+)/.test(request.url)) {
            Delete(response, /\/api\/delete\/(\w+)/.exec(request.url))
        }
    }
    else if (request.method === "PUT") {
        if (/\/api\/edit\/(\w+)/.test(request.url)) {
            Update(request, response, /\/api\/edit\/(\w+)/.exec(request.url))
        }
    }
    else if (request.method === "OPTIONS") {
        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS, PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        response.end();
    }
}

const port = 8080
const server = createServer(mainHandler);
server.listen(port, "localhost", () => {
    console.log(`Running at ${port} fyi`)
})

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
    } catch (except) {
        console.error(except)
    }

    const chosenDB = "hola"
    const DB = mongoClient.db(chosenDB)

    const chosenCollection = "hola"
    let collection = DB.collection(chosenCollection).find({})

    return (await collection.toArray())
}

run().catch(console.log)
