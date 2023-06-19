package utils

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type VideoData struct {
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
    XForwardedForIP    string   `json:"__x_forwarded_for_ip"`
}

func CheckDbName(client *mongo.Client, name string) (bool, error) {
    list, err := client.ListDatabaseNames(context.TODO(), bson.D{})
    if err != nil {
        return false, err;
    }
    for _, el := range list {
        if el == name {
            return true, nil;
        }
    }
    return false, errors.New("Database not found")
}
