use actix_web::{get, Responder, HttpResponse};

#[get("/healthcheck")]
pub async fn healthcheck() -> impl Responder {
    HttpResponse::NoContent()
}
