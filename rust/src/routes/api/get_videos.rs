use actix_web::{get, Responder, HttpResponse, web};
use futures::TryStreamExt;
use mongodb::bson::doc;

use crate::{db::schemas::VideoData, AppState};

/*
    Results from queries are generally returned via Cursor, a struct which
    streams the results back from the server as requested. The Cursor type
    implements the Stream trait from the futures crate, and in order to
    access its streaming functionality you need to import at least one of
    the StreamExt or TryStreamExt traits.
*/
#[get("/videos")]
pub async fn get_videos(state: web::Data<AppState>) -> impl Responder {
    let videos = state.videos_collection.find(None, None).await;

    if videos.is_err() {
        return HttpResponse::InternalServerError().json(doc! {
            "message": "Error while trying to get videos"
        });
    }

    let videos: Result<Vec<VideoData>, _> = videos.unwrap().try_collect().await;

    if videos.is_err() {
        return HttpResponse::InternalServerError().json(doc! {
            "status": 500,
            "message": "Error while trying to collect videos"
        });
    }

    let videos = videos.unwrap();
    HttpResponse::Ok().json(videos)
}
