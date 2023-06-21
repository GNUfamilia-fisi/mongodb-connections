using MongoDB.Driver;
using MongoDB.Bson;

var env = Environment.GetEnvironmentVariables();
var MONGO_URI = env["MONGO_URI"]?.ToString();
var DB_NAME = env["DB_NAME"]?.ToString();
var DB_COLLECTION = env["DB_COLLECTION"]?.ToString();

if (MONGO_URI == null || DB_NAME == null || DB_COLLECTION == null) {
    Console.WriteLine(
        "You must create an .env file with the variables defined in .env.example"
    );
    Environment.Exit(0);
}

var client = new MongoClient(MONGO_URI);
var collection = client
    .GetDatabase(DB_NAME)
    .GetCollection<BsonDocument>(DB_COLLECTION);

// An empty filter matchs everything
var filter = Builders<BsonDocument>.Filter.Empty;
var woshingo_videos = collection
    .Find<BsonDocument>(filter)
    .SortBy(video => video["view_count"]);

// Convert the cursor to an IEnumerable and iterate 🌿
foreach (var video in woshingo_videos.ToEnumerable()) {
    Console.WriteLine(
        "👉 {0} ({1} min) [{2} views]\n{3}\n",
        video["title"],
        (video["duration"].ToInt32() / 60),
        video["view_count"],
        video["url"]
    );
}
