use actix_web::{options, post, Responder, HttpResponse, web};
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;
use crate::{AppState, db::schemas::VideoData};

#[derive(Deserialize)]
pub struct UploadPayload {
    title: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
}

#[options("/upload")]
pub async fn upload_video_options() -> impl Responder {
    HttpResponse::Ok()
        .append_header(("Access-Control-Allow-Methods", "POST, OPTIONS"))
        .append_header(("Access-Control-Allow-Headers", "Content-Type, x-requested-with, X-Custom-Header, Authorization"))
        .finish()
}

#[post("/upload")]
pub async fn upload_video(state: web::Data<AppState>, video: web::Json<UploadPayload>) -> impl Responder {
    let video_to_upload = video.into_inner();

    if video_to_upload.title.is_none() || video_to_upload.description.is_none() || video_to_upload.thumbnail.is_none() {
        return HttpResponse::BadRequest().json(doc! {
            "message": "Missing required fields. Must define title, description, thumbnail as strings"
        });
    }

    let video_to_upload = VideoData {
        id: ObjectId::new().to_string(),
        title: video_to_upload.title.unwrap(),
        description: video_to_upload.description.unwrap(),
        thumbnail: video_to_upload.thumbnail.unwrap(),
    };


    match state.videos_collection.insert_one(&video_to_upload, None).await {
        Ok(_) => {
            HttpResponse::Ok().json(video_to_upload)
        },
        Err(_) => {
            HttpResponse::InternalServerError().json(doc! {
                "message": "Error while trying to upload video"
            })
        }
    }
}
