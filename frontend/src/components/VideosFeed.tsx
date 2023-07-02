import { useEffect, useRef, useState } from 'react';
import Modal, { ModalProps } from 'react-overlays/Modal'
import { VideosList } from './VideosList';
import { fetcher } from '../fetcher';
import { $videosFeed, VideoSchema, addVideo } from '../stores/videosStore';
import { BackendLogo } from './BackendLogo';
import { $backend } from '../stores/backendStore';
import styles from '../styles/VideosFeed.module.scss';

type SumbitFileFormData = {
  title: string;
  description: string;
  thumbnail: File;
}

const FormsModal = (props: ModalProps & { closeModal: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const previewRef = useRef<HTMLImageElement>(null);

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as SumbitFileFormData;

    // if not file
    if (!data.thumbnail) {
      setErrorMessage('Please select a file');
      return;
    }

    if (data.thumbnail.size > 10000000) {
      setErrorMessage('File too large');
      return;
    }

    if (!data.thumbnail.type.includes('image')) {
      setErrorMessage('File type not supported');
      return;
    }

    if (!data.title || !data.description) {
      setErrorMessage('Please fill all fields');
      return;
    }

    if (data.thumbnail) {
      const reader = new FileReader();
      reader.readAsDataURL(data.thumbnail);
      reader.onload = () => {
        const base64 = reader.result;
        console .log({base64})
        if (typeof base64 === 'string') {
          addVideo({
            title: data.title,
            description: data.description,
            thumbnail: base64
          }).then(() => {
            props.closeModal();
          })
          .catch((err) => {
            setErrorMessage(err.message);
          });
        }
      }
    }

  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]!;
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 === 'string') {
          previewRef.current!.src = base64;
        }
      }
    }
  }

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
      <form className={styles.addVideoForm} onSubmit={handleAddVideo}>
        <h3>Add new video</h3>
        <label htmlFor='title'>Title</label>
        <input type='text' name='title' placeholder='Be concise and engaging!' />
        <label htmlFor='description'>Description</label>
        <input type='text' name='description' placeholder='Say something about this video...' />
        <label htmlFor='thumbnail'>Thumbnail</label>
        <input
          type='file'
          name='thumbnail'
          onChange={handleFileUpload}
        />
        <img
          ref={previewRef}
          width={200}
          src=''
          alt='A preview will appear here 🖼️'
        />
        {
          errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )
        }
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
        closeModal={() => {
          setIsAddingVideo(false);
        }}
      />
      <div className={styles.controllers}>
        <section>
          <BackendLogo />
        </section>
        <button onClick={() => setIsAddingVideo(true)}>
          Add new video
        </button>
      </div>
      <VideosList />
    </main>
  );
}
