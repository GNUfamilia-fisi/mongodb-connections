export interface YoutubeVideo {
  __last_playlist_index: number;
  __x_forwarded_for_ip: null;
  _id: string;
  _type: Type;
  _version: YTDLPVersion;
  availability: null;
  channel: null;
  channel_id: null;
  channel_url: null;
  description: string;
  duration: number;
  duration_string: string;
  epoch: number;
  extractor: Extractor;
  extractor_key: Key;
  filename: string;
  id: string;
  ie_key: Key;
  live_status: null;
  n_entries: number;
  original_url: string;
  playlist: Playlist;
  playlist_autonumber: number;
  playlist_count: number;
  playlist_id: PlaylistID;
  playlist_index: number;
  playlist_title: Playlist;
  playlist_uploader: PlaylistUploader;
  playlist_uploader_id: PlaylistID;
  release_timestamp: null;
  thumbnails: Thumbnail[];
  timestamp: null;
  title: string;
  url: string;
  urls: string;
  view_count: number;
  webpage_url: string;
  webpage_url_basename: WebpageURLBasename;
  webpage_url_domain: WebpageURLDomain;
}

export enum Type {
  URL = 'url',
}

export interface YTDLPVersion {
  current_git_head: null;
  release_git_head: string;
  repository: string;
  version: string;
}

export enum Extractor {
  Youtube = 'youtube',
}

export enum Key {
  Youtube = 'Youtube',
}

export enum Playlist {
  WoshingoVideos = 'Woshingo - Videos',
}

export enum PlaylistID {
  UCnuQiFVNBo87AhxLAw2ABew = 'UCnuQiFVNBo87ahxLAw2aBew',
}

export enum PlaylistUploader {
  Woshingo = 'Woshingo',
}

export interface Thumbnail {
  height: number;
  url: string;
  width: number;
}

export enum WebpageURLBasename {
  Watch = 'watch',
}

export enum WebpageURLDomain {
  YoutubeCOM = 'youtube.com',
}
