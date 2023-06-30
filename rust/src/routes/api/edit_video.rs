use actix_web::{options, put, Responder, HttpResponse, web};
use mongodb::bson::doc;
use serde::Deserialize;
use crate::AppState;

#[derive(Deserialize)]
pub struct EditPayload {
    title: Option<String>,
    description: Option<String>,
    thumbnail: Option<String>,
}

#[options("/edit/{video_id}")]
pub async fn edit_video_options() -> impl Responder {
    HttpResponse::Ok()
}

#[put("/edit/{video_id}")]
pub async fn edit_video(video_id: web::Path<String>, state: web::Data<AppState>, video: web::Json<EditPayload>) -> impl Responder {
    let video_id = video_id.into_inner();

    let query = doc! { "_id": video_id };
    let options = mongodb::options::FindOneAndUpdateOptions::builder()
        .return_document(mongodb::options::ReturnDocument::After)
        .build();

    let video_edited = state.videos_collection.find_one_and_update(query, doc! {
        "$set": {
            "title": &video.title,
            "description": &video.description,
            "thumbnail": &video.thumbnail,
        }
    }, options).await;

    if video_edited.is_err() {
        return HttpResponse::InternalServerError().json(doc! {
            "status": 500,
            "message": "Error while trying to edit a videos"
        });
    }

    let video_edited = video_edited.unwrap();
    if video_edited.is_none() {
        return HttpResponse::NotFound().json(doc! {
            "status": 404,
            "message": "Video not found"
        });
    }

    HttpResponse::Ok().json(video_edited.unwrap())
}
