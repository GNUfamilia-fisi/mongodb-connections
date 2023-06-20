import { app } from './app.js';
import { db } from './services/mongo.js';
import { YoutubeVideo } from './structs/youtube_video.js';

const { PORT } = process.env;
const { COLLECTION_NAME } = process.env;

if (!COLLECTION_NAME) {
  console.error('Please define the \'COLLECTION_NAME\' env variable');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`listening on port ${PORT} 🎊`);
});

app.get('/videos', async (req, res) => {
  const videos_collection = db.collection(COLLECTION_NAME);
  const videos = await videos_collection.find<YoutubeVideo>({}).toArray();

  res.send(
    videos.map(video => ({
      title: video.title,
      description: video.description,
      url: video.url,
      duration: video.duration
    }))
  );
});
