use serde::{Serialize, Deserialize};

// intherit from ResponseBase
#[derive(Serialize, Deserialize)]
pub struct VideoData {
    #[serde(rename = "_id")]
    pub id: String,
    pub title: String,
    pub description: String,
    pub thumbnail: String
}
