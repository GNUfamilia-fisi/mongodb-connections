use std::str::FromStr;
use actix_web::{delete, options, Responder, HttpResponse, web};
use mongodb::bson::{oid::ObjectId, doc};
use crate::AppState;

#[options("/delete/{video_id}")]
pub async fn delete_video_options() -> impl Responder {
    HttpResponse::Ok()
        .append_header(("Access-Control-Allow-Methods", "DELETE, OPTIONS"))
        .append_header(("Access-Control-Allow-Headers", "Content-Type, x-requested-with, X-Custom-Header, Authorization"))
        .finish()
}

#[delete("/delete/{video_id}")]
pub async fn delete_video(video_id: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let oid = ObjectId::from_str(video_id.into_inner().as_str());

    if oid.is_err() {
        return HttpResponse::BadRequest().json(doc! {
            "status": 400,
            "message": "Invalid video id"
        });
    }

    let query = doc! { "_id": oid.unwrap().to_string() };
    let deleted_video = state.videos_collection.find_one_and_delete(query, None).await;

    if deleted_video.is_err() {
        return HttpResponse::InternalServerError().json(doc! {
            "status": 500,
            "message": "Error while trying to delete video"
        });
    }

    let deleted_video = deleted_video.unwrap();
    if deleted_video.is_none() {
        return HttpResponse::NotFound().json(doc! {
            "status": 404,
            "message": "Video not found"
        });
    }

    HttpResponse::Ok().json(deleted_video)
}
