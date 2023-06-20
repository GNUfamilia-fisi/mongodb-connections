package main

import (
	"context"
	"fmt"
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

var dbClient *mongo.Client;

func main() {
    var newURI envURI;

    res, err := env.GetFromEnv("./.env");
    if err != nil { log.Fatal(err) }

    newURI.Uri = res["mongo-URI"]

    serverApiOpts := options.ServerAPI(options.ServerAPIVersion1);
    opts := options.Client().ApplyURI(newURI.Uri).SetServerAPIOptions(serverApiOpts);

    var connErr error;
    
    fmt.Println("Connecting to the cluster...");

    dbClient, connErr := mongo.Connect(context.TODO(), opts);
    if connErr != nil { log.Fatal(connErr) }
    
    fmt.Println();

    dblist, listErr := dbClient.ListDatabaseNames(context.TODO(), bson.D{}, options.ListDatabases());
    if listErr != nil { log.Fatal(listErr) }

    fmt.Println("Databases:");
    for i := range dblist {
        fmt.Println(dblist[i])
    }

    var database string;
    collection := "metadata";

    fmt.Printf("\nSelect database>> ");
    fmt.Scan(&database);

    fmt.Println();

    fmt.Printf("Retrieving data...\n\n")
    
    filter := bson.D{};

    foo, err := utils.CheckDbName(dbClient, database);
    if err != nil { log.Fatal(err) }

    if !foo {
        log.Println("Beware! you are trying to connect to a non-existing database, the server will create an empty one for you to access")
    }

    metadataWoshDB := dbClient.Database(database).Collection(collection);
    
    cursor, cursorErr := metadataWoshDB.Find(context.TODO(), filter);
    if cursorErr != nil { log.Fatal(cursorErr) }

    var results []utils.VideoData;
    cursor.All(context.TODO(), &results);

    for _, elem := range results {
        fmt.Printf("Video: %s\n", elem.Title);
        fmt.Printf("Duration: %d\n\n", elem.Duration)
    }
}
