<!-- markdownlint-disable MD033 -->
# MongoDB with Ruby

<img align="right" width="200" src="https://github.com/cat-milk/Anime-Girls-Holding-Programming-Books/blob/master/Ruby/Saber_Alter_Ruby.png?raw=true" alt="professor woshingo"/>

This repo shows how to connect to MongoDB using the official Ruby driver.

Ruby is really really really easy to use, all does what you expect to do,
and all just works. That's nice and welcome, but when building big problems,
it's highly encouraged to use a framework on top of Ruby, like Rails.

This repo only shows a basic connection and data query, no frameworks, just
the `mongo` gem.

Resources used:

- Official Ruby driver documentation: <https://rubygems.org/gems/mongo/versions/2.2.5>
- Ruby gem page: <https://rubygems.org/gems/mongo/versions/2.2.5>
- MongoDB Ruby guide by ZetCode: <https://zetcode.com/db/mongodbruby/>

---

## About the data

The `sample_woshingo` database queried here contains the complete list of
videos of the Mexican youtuber [Woshingo](https://www.youtube.com/@Woshingo), scrapped using [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## About the code

The MongoDB driver dependency is defined in the [Gemfile](GemFile).

```GemFile
gem "mongo", "~> 2"
```

Ammng all the programming languages available in this repo, I think that
Ruby is the simplest to use (frighteningly simple).

```ruby
client = Mongo::Client.new(
    ENV['MONGO_URI'],
    :database => ENV['DB_NAME']
)
woshingo_videos = client.database.collection(ENV['DB_COLLECTION'])

found_videos = woshingo_videos.find({}).to_a

found_vieos.each do |video|
  puts '🍃 ' << video['title'] << "\n   " << video['url'] << "\n\n"
end
```

## Running the code

First you will need a running MongoDB cluster. You can use a local instance or
preferably deploy a free tier cluster in the cloud using MongoDB Atlas.

You will also need to install the `mongo` gem.

```sh
# For UNIX systems
sudo gem install mongo
```

After cloning the repo, create a `.env` file with your connection string:

```sh
export MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>"
export DB_NAME="sample_woshingo"
export DB_COLLECTION="metadata"
```

Finally, you can run the code with:

```sh
# Load your env variables first
source .env
ruby app.rb
```

## Results

Here we print the full list of Woshingo videos, picking only the properties that interest us.

https://github.com/GNUfamilia-fisi/mongodb-connections/assets/98111143/3d56d9c4-5c44-4ccc-a9fd-3425cf642c74
