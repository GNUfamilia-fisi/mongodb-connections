import { useEffect, useState } from 'react';
import Modal, { ModalProps } from 'react-overlays/Modal'
import { VideosList } from './VideosList';
import { fetcher } from '../fetcher';
import { $videosFeed, VideoSchema, addVideo } from '../stores/videosStore';
import styles from '../styles/VideosFeed.module.scss';
import { BackendLogo } from './BackendLogo';
import { $backend } from '../stores/backendStore';

const FormsModal = (props: ModalProps) => {
  const handleAddVideo = () => {
    addVideo({
      title: "hola",
      description: "hola",
      thumbnail: "hola",
    })
  };

  return (
    <Modal {...props} style={{
      position: "fixed",
      width: "400px",
      zIndex: 1040,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      border: "1px solid #1E1E1E",
      backgroundColor: "#1f1f1f",
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
      padding: "20px",
    }}>
      <form onSubmit={handleAddVideo}>
        <input type='text' name='title' />
        <input type='text' name='description' />
        <input type='file' name='video' />
        <button type='submit'>Upload</button>
      </form>
    </Modal>
  );
}

export function VideosFeed() {
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [reRenderList, forceReRenderList] = useState(false);

  useEffect(() => {
    $backend.subscribe(() => {
      forceReRenderList((prev) => !prev);
    });
  }, []);

  useEffect(() => {
    console.log("re fetching")
    fetcher(['/api/videos'], { headers: { 'accept': 'application/json' } })
      .then(response => response.json())
      .then((videos: VideoSchema[]) => {
        const fetched = videos.map(videoData => {
          return { data: videoData };
        });
        $videosFeed.set(fetched)
    })
  }, [reRenderList]);

  const Backdrop = () => {
    return (
      <div
        onClick={() => setIsAddingVideo(false)}
        style={{
          "position": "fixed",
          "zIndex": 1040,
          "inset": 0,
          "backgroundColor": "#1E1E1E",
          "opacity": 0.55,
        }}
      />
    );
  }

  return (
    <main className={styles.main}>
      <FormsModal
        show={isAddingVideo}
        renderBackdrop={Backdrop}
      />
      <div className={styles.controllers}>
        <section>
          <BackendLogo />
        </section>
        <button onClick={() => { setIsAddingVideo(true) }}>
          Añadir video
        </button>
      </div>
      <VideosList />
    </main>
  );
}
