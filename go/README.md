# monGO connection <img title="" src="https://raw.githubusercontent.com/GolangUA/gopher-logos/master/PNG/gopher_birthday.png" alt="gopher_logo" width="40" data-align="inline">

Client - Database connection test made with [golang](https://go.dev/), made as homework for the "introduction to software engineering" course @FISI-UNMSM :heart:



The `metadata` collection at the `sample_woshingo` database of the cluster used in the example was filled with the metadata from all of [@Woshingo](https://www.youtube.com/user/Woshingo)'s videos.



> this is the basic structure of a single document from that collection but in a golang-like syntax:
> 
> ```go
> type VideoData struct {
>     Type        string          `json:"_type"`
>     IeKey       string          `json:"ie_key"`
>     ID          string          `json:"id"`
>     URL         string          `json:"url"`
>     Title       string          `json:"title"`
>     Description string          `json:"description"`
>     Duration    int             `json:"duration"`
>     ChannelID   string          `json:"channel_id"`
>     Channel     string          `json:"channel"`
>     ChannelURL  string          `json:"channel_url"`
>     Thumbnails  []struct {
>     	URL    string           `json:"url"`
>     	Height int              `json:"height"`
>     	Width  int              `json:"width"`
>     } `json:"thumbnails"`
>     Timestamp          string   `json:"timestamp"`
>     ReleaseTimestamp   string   `json:"release_timestamp"`
>     Availability       string   `json:"availability"`
>     ViewCount          int      `json:"view_count"`
>     LiveStatus         string   `json:"live_status"`
>     WebpageURL         string   `json:"webpage_url"`
>     OriginalURL        string   `json:"original_url"`
>     WebpageURLBasename string   `json:"webpage_url_basename"`
>     WebpageURLDomain   string   `json:"webpage_url_domain"`
>     Extractor          string   `json:"extractor"`
>     ExtractorKey       string   `json:"extractor_key"`
>     PlaylistCount      int      `json:"playlist_count"`
>     Playlist           string   `json:"playlist"`
>     PlaylistID         string   `json:"playlist_id"`
>     PlaylistTitle      string   `json:"playlist_title"`
>     PlaylistUploader   string   `json:"playlist_uploader"`
>     PlaylistUploaderID string   `json:"playlist_uploader_id"`
>     NEntries           int      `json:"n_entries"`
>     PlaylistIndex      int      `json:"playlist_index"`
>     LastPlaylistIndex  int      `json:"__last_playlist_index"`
>     PlaylistAutonumber int      `json:"playlist_autonumber"`
>     DurationString     string   `json:"duration_string"`
>     Epoch              int      `json:"epoch"`
>     Filename           string   `json:"filename"`
>     Urls               string   `json:"urls"`
>     Version struct {
>     	Version        string   `json:"version"`
>     	CurrentGitHead string   `json:"current_git_head"`
>     	ReleaseGitHead string   `json:"release_git_head"`
>     	Repository     string   `json:"repository"`
>     } `json:"_version"`
>     XForwardedForIP    string   `json:"__x_forwarded_for_ip"`
> }
> 
> ```

https://github.com/GNUfamilia-fisi/mongodb-connections/assets/71461113/d6fa1943-72e5-4a24-824d-8359ac1f0553

### Before running the code

Before actually being able to run this code, you need:

- The go toolkit installed and added to your `$PATH` (in UNIX-like systems) or `%PATH%` (in MS-DOS-like ones). You can follow the official installation  tutorial at go's website -> [Download and install - The Go Programming Language](https://go.dev/doc/install)

- [Once go was installed...] You can add the mongo drivers package for go at your module, which you can do by following this tutorial at the official `quick-start` mongodb's guide website -> [MongoDB Golang Quick Start](https://www.mongodb.com/docs/drivers/go/current/quick-start/#std-label-golang-quickstart)



### Running it

To run it you can just execute:

```sh
go run mon.go
```
