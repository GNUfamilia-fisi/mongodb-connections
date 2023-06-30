import { useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { deleteFromList, updateVideo, type VideoFeedItem } from '../stores/videosStore';
import { fetcher } from '../fetcher';
import styles from '../styles/VideoCard.module.scss';

type Props = {
  position: number,
  video: VideoFeedItem;
};

export function VideoCard({ position, video }: Props) {
  const [editing, setEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const titleRef = useRef(video.data.title);
  const descriptionRef = useRef(video.data.description);

  const handleTitleChange = (evt: ContentEditableEvent) => { titleRef.current = evt.target.value; };
  const handleDescriptionChange = (evt: ContentEditableEvent) => { descriptionRef.current = evt.target.value; };

  const handleDelete = async () => {
    const response = await fetcher(['/api/delete/', video.data._id], {
      method: 'DELETE'
    });
    if (response.ok) {
      deleteFromList(video.data._id);
    }
  };

  const handleSave = () => {
    if (!editing) return;
    updateVideo({
      _id: video.data._id,
      title: titleRef.current,
      description: descriptionRef.current,
      thumbnail: video.data.thumbnail
    });
    setEditing(false);
  }
  const handleCancelEdit = () => {
    setEditing(false);
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${styles.videoCard} ${hovered ? styles.hovered : ''} ${editing ? styles.editing : ''}`}
    >
      <div className={styles.number}>
        {position}
      </div>
      <div>
        {
          video.data.thumbnail.startsWith('http') ? (
            <img src={video.data.thumbnail} />
          ) : (
            <img src={`data:image/jpeg;base64,${video.data.thumbnail}`} />
          )
        }
      </div>
      <div className={styles.content}>
        <h3>
          <ContentEditable
            title={descriptionRef.current}
            html={titleRef.current}
            disabled={!editing}
            defaultValue={video.data.title}
            onChange={handleTitleChange}
          />
        </h3>
        <section>
          <ContentEditable
            title={descriptionRef.current}
            html={descriptionRef.current}
            disabled={!editing}
            defaultValue={video.data.description}
            onChange={handleDescriptionChange}
          />
        </section>
      </div>
      <div className={styles.controllers}>
        {
          editing ? (
            <>
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )
        }
      </div>
    </div>
  );
}
