package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type videoData struct {
    Type        string          `json:"_type"`
    IeKey       string          `json:"ie_key"`
    ID          string          `json:"id"`
    URL         string          `json:"url"`
    Title       string          `json:"title"`
    Description string          `json:"description"`
    Duration    int             `json:"duration"`
    ChannelID   string          `json:"channel_id"`
    Channel     string          `json:"channel"`
    ChannelURL  string          `json:"channel_url"`
    Thumbnails  []struct {
    	URL    string           `json:"url"`
    	Height int              `json:"height"`
    	Width  int              `json:"width"`
    } `json:"thumbnails"`
    Timestamp          string   `json:"timestamp"`
    ReleaseTimestamp   string   `json:"release_timestamp"`
    Availability       string   `json:"availability"`
    ViewCount          int      `json:"view_count"`
    LiveStatus         string   `json:"live_status"`
    XForwardedForIP    string   `json:"__x_forwarded_for_ip"`
    WebpageURL         string   `json:"webpage_url"`
    OriginalURL        string   `json:"original_url"`
    WebpageURLBasename string   `json:"webpage_url_basename"`
    WebpageURLDomain   string   `json:"webpage_url_domain"`
    Extractor          string   `json:"extractor"`
    ExtractorKey       string   `json:"extractor_key"`
    PlaylistCount      int      `json:"playlist_count"`
    Playlist           string   `json:"playlist"`
    PlaylistID         string   `json:"playlist_id"`
    PlaylistTitle      string   `json:"playlist_title"`
    PlaylistUploader   string   `json:"playlist_uploader"`
    PlaylistUploaderID string   `json:"playlist_uploader_id"`
    NEntries           int      `json:"n_entries"`
    PlaylistIndex      int      `json:"playlist_index"`
    LastPlaylistIndex  int      `json:"__last_playlist_index"`
    PlaylistAutonumber int      `json:"playlist_autonumber"`
    DurationString     string   `json:"duration_string"`
    Epoch              int      `json:"epoch"`
    Filename           string   `json:"filename"`
    Urls               string   `json:"urls"`
    Version struct {
    	Version        string   `json:"version"`
    	CurrentGitHead string   `json:"current_git_head"`
    	ReleaseGitHead string   `json:"release_git_head"`
    	Repository     string   `json:"repository"`
    } `json:"_version"`
}

type env struct {
    Uri string `json:"mongo-URI"`;
}

func main() {
    envsByte, readErr := os.ReadFile("./.env")
    if readErr != nil {
        log.Fatal(readErr);
    }
    var newURI env;
    err := json.Unmarshal(envsByte, &newURI);
    if err != nil {
        log.Fatal(err)
    }
    
    serverApiOpts := options.ServerAPI(options.ServerAPIVersion1);
    opts := options.Client().ApplyURI(newURI.Uri).SetServerAPIOptions(serverApiOpts);

    newClient, connErr := mongo.Connect(context.TODO(), opts);
    if connErr != nil {
        log.Fatal(connErr);
    }

    dblist, _ := newClient.ListDatabaseNames(context.TODO(), bson.D{}, options.ListDatabases());

    for i := range dblist {
        println(dblist[i])
    }

    filter := bson.D{
        {"_type", "url"},
    };

    metadataWoshDB := newClient.Database("sample_woshingo").Collection("metadata");
    
    cursor, cursorErr := metadataWoshDB.Find(context.TODO(), filter);
    if cursorErr != nil {
        log.Fatal(cursorErr);
    }

    println(cursor)
    
    var results []videoData;
    cursor.All(context.TODO(), &results);

    for _, elem := range results {
        marsh, _ := json.Marshal(elem);
        println(string(marsh));
    }
}
