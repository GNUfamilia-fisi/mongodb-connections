use mongodb::{results::DatabaseSpecification, bson::Document};
#[allow(unused)]
use serde::{Serialize, Deserialize};
use std::env;

mod dotenv;

static APP_DB: &str = "sample_woshingo";
static WOSHINGO_COLLECTION: &str = "metadata";
// use std::convert::Infallible;

// type WebResult<T> = Result<T, Rejection> // from warp

fn print_db_info(db: &DatabaseSpecification) {
    println!(" - {} ({} mb)", db.name, db.size_on_disk as f64 / (1024.0 * 1024.0));
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv::parse()?;

    let mongo_uri = env::var("MONGO_URI")
        .expect("please define the MONGO_URI env variable");
    // Create a mongodb client from a connection string
    let client = mongodb::Client::with_uri_str(mongo_uri).await?;

    println!("Listing databases...");
    let db_names = client.list_databases(None, None).await?;
    let exists_db = db_names.iter().any(|db_info| {
        print_db_info(db_info);
        db_info.name == APP_DB
    });
    println!();

    if !exists_db {
        eprintln!("Coudln't found DB '{}'", APP_DB);
        return Ok(());
    }

    // To work with collections, there are methods that accepts instances of
    // your documents, (say `db.insert_one`).
    // That instances must implement the Serialize and Deserialize traits from `serde`.
    // You can always use mongodb::bson::Document, however it's recommended to define
    // your own types for serialization and deserialization
    let woshingo = client
        .database(APP_DB)
        .collection::<Document>(WOSHINGO_COLLECTION);

    // Querying returns a Cursor type to iterate over
    println!("Querying woshingo urls...");
    let mut documents = woshingo.find(None, None).await?;

    // Iterate over the results of the cursor.
    // This trait is required to use `try_next()` on the cursor
    use futures::stream::TryStreamExt;
    while let Some(doc) = documents.try_next().await? {
        println!(" - {}", doc.get_str("url").unwrap());
    }

    Ok(())
}
