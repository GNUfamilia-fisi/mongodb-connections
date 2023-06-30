use actix_web::{middleware, HttpServer, App, web};
use db::schemas::VideoData;
use dotenv::dotenv;

mod db;
mod routes;

pub struct AppState {
    pub app_name: String,
    pub mongo_client: mongodb::Client,
    pub videos_collection: mongodb::Collection<VideoData>,
}

impl AppState {
    async fn init() -> Self {
        let mongo_client = db::create_mongo_client()
            .await
            .expect("Couldn't connect to MongoDB");

        let videos_collection = mongo_client.database("crud_app").collection::<VideoData>("videos6");

        AppState {
            app_name: String::from("Rust CRUD"),
            mongo_client,
            videos_collection
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }

    let app_state = web::Data::new(AppState::init().await);

    pretty_env_logger::init();
    println!("🚀 Server started successfully!!!");

    HttpServer::new(move || {
        App::new().service(
            web::scope("/api")
            .app_data(app_state.clone())
            .service(routes::api::healthcheck::healthcheck)
            .service(routes::api::upload_video::upload_video)
            .service(routes::api::upload_video::upload_video_options)
            .service(routes::api::get_videos::get_videos)
            .service(routes::api::get_video::get_video)
            .service(routes::api::delete_video::delete_video)
            .service(routes::api::delete_video::delete_video_options)
            .service(routes::api::edit_video::edit_video_options)
            .service(routes::api::edit_video::edit_video)
        ).wrap(
            middleware::DefaultHeaders::new()
                .add(("Access-Control-Allow-Origin", "*"))
        ).wrap(middleware::Logger::default())
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
