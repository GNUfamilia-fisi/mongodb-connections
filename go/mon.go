package main

import (
	"context"
	"encoding/json"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	env "mongo/dotenv"
	utils "mongo/utils"
)

type envURI struct {
    Uri string `json:"URI"`
}

func main() {
    var newURI envURI;

    res, err := env.GetFromEnv("./.env");
    if err != nil { log.Fatal(err) }

    newURI.Uri = res["mongo-URI"]

    serverApiOpts := options.ServerAPI(options.ServerAPIVersion1);
    opts := options.Client().ApplyURI(newURI.Uri).SetServerAPIOptions(serverApiOpts);

    newClient, connErr := mongo.Connect(context.TODO(), opts);
    if connErr != nil { log.Fatal(connErr) }

    dblist, listErr := newClient.ListDatabaseNames(context.TODO(), bson.D{}, options.ListDatabases());
    if listErr != nil { log.Fatal(listErr) }

    for i := range dblist {
        println(dblist[i])
    }

    filter := bson.D{
        {"_type", "url"},
    };
    
    database := "sample_woshingo";
    collection := "metadata";

    foo, err := utils.CheckDbName(newClient, database);
    if err != nil { log.Fatal(err) }

    if !foo {
        log.Println("Beware! you are trying to connect to a non-existing database, the server will create an empty one for you to access")
    }

    metadataWoshDB := newClient.Database(database).Collection(collection);
    
    cursor, cursorErr := metadataWoshDB.Find(context.TODO(), filter);
    if cursorErr != nil { log.Fatal(cursorErr) }

    println(cursor)
    
    var results []utils.VideoData;
    cursor.All(context.TODO(), &results);

    for _, elem := range results {
        marsh, _ := json.Marshal(elem);
        println(string(marsh));
    }
}
