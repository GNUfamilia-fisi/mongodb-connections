import { action, atom } from 'nanostores';
import { fetcher } from '../fetcher';

type mongo_id = string;

export type VideoSchema = {
  _id: mongo_id;
  title: string;
  description: string;
  thumbnail: string;
}

export type VideoFeedItem = {
  data: VideoSchema
}

export const $videosFeed = atom<VideoFeedItem[]>([]);

const uploadVideo = async (video: Omit<VideoSchema, '_id'>): Promise<VideoFeedItem> => {
  const response = await fetcher(['/api/upload'], {
    method: 'POST',
    body: JSON.stringify(video)
  });

  const savedVideo = await response.json();
  return savedVideo;
}

export const addVideoToList = action(
  $videosFeed, 'addVideoToList', async (store, video: Omit<VideoSchema, '_id'>) => {
    const uploaded = await uploadVideo({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail
    });

    const newVideos: VideoFeedItem[] = [...store.get(), uploaded];
    store.set(newVideos);
    return newVideos;
  }
);

export const deleteFromList = action(
  $videosFeed, 'deletFromFeed', async (store, video_id: mongo_id) => {
    store.set([...store.get().filter((item) => item.data._id !== video_id)])
  }
)

export const updateVideo = action(
  $videosFeed, 'updateVideo', async (store, video: VideoSchema) => {
    const response = await fetcher(['/api/edit/', video._id], {
      method: 'PUT',
      body: (JSON.stringify({
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail
      })),
      headers: {
        'content-type': 'application/json'
      }
    });

    const updatedVideo = await response.json();
    console.log({updatedVideo})
    const newVideos = [...store.get().map((item) => {
      if (item.data._id === updatedVideo._id) {
        return { data: updatedVideo };
      }
      return item;
    })];

    store.set(newVideos);
    return newVideos;
  }
);

export const addVideo = action(
  $videosFeed, 'addVideo', async (store, video: Omit<VideoSchema, '_id'>) => {
    const response = await fetcher(['/api/upload'], {
      method: 'POST',
      body: JSON.stringify(video),
      headers: {
        'content-type': 'application/json'
      }
    });

    const savedVideo = await response.json();
    const newVideos = [...store.get(), { data: savedVideo }];
    store.set(newVideos);
    return newVideos;
  }
)
