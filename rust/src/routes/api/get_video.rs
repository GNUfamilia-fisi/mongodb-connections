use std::str::FromStr;
use actix_web::{get, Responder, HttpResponse, web};
use mongodb::bson::{oid::ObjectId, doc};
use crate::{AppState};

#[get("/videos/{video_id}")]
pub async fn get_video(video_id: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let oid = ObjectId::from_str(video_id.into_inner().as_str());

    if oid.is_err() {
        return HttpResponse::NotFound().json(doc! {
            "status": 404,
            "message": "Video not found"
        });
    }

    let filter = doc! { "_id": oid.unwrap() };
    let video_found = state.videos_collection.find_one(filter, None).await;

    if video_found.is_err() {
        return HttpResponse::InternalServerError().json(doc! {
            "status": 500,
            "message": "Error while trying to get videos"
        });
    }

    let video_found = video_found.unwrap();
    if video_found.is_none() {
        return HttpResponse::NotFound().json(doc! {
            "status": 404,
            "message": "Video not found"
        });
    }

    HttpResponse::Ok().json(video_found.unwrap())
}
