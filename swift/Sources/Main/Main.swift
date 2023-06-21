import MongoSwift
import NIOPosix
import Foundation

let elg = MultiThreadedEventLoopGroup(
    numberOfThreads: 4
)

let MONGO_URI = ProcessInfo.processInfo.environment["MONGO_URI"] ?? "mongodb://localhost:27017"
let DB_NAME = ProcessInfo.processInfo.environment["DB_NAME"] ?? "new_db"
let DB_COLLECTION = ProcessInfo.processInfo.environment["DB_COLLECTION"] ?? "new_collection"

let client = try MongoClient(MONGO_URI, using: elg)

defer {
    // clean up driver resources
    try? client.syncClose()
    cleanupMongoSwift()

    // shut down EventLoopGroup
    try? elg.syncShutdownGracefully()
}

let db = client.db(DB_NAME)
let collection = db.collection(DB_COLLECTION)

// empty query will match all the woshingo videos 🥳
let query: BSONDocument = [:]
let options = FindOptions(sort: ["view_count": 1])

for try await doc in try await collection.find(query, options: options) {
    print(
        String(format: "🐈 %@ (%@)\n   %@\n",
            doc["title"]?.stringValue ?? "Untitled",
            doc["duration_string"]?.stringValue ?? "?",
            doc["url"]?.stringValue ?? ""
        )
    )
}
