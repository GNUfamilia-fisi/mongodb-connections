// MongoDB schemas definitions
pub mod schemas;

pub async fn create_mongo_client() -> Result<mongodb::Client, mongodb::error::Error> {
    let mut options = mongodb::options::ClientOptions::parse(
        std::env::var("MONGO_URI").unwrap_or("mongodb://localhost:27017".to_string())
    ).await.unwrap();

    options.app_name = Some("Rust CRUD".to_string());
    mongodb::Client::with_options(options)
}
