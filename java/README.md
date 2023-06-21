<!-- markdownlint-disable MD033 -->
# MongoDB with Java ☕

<img align="right" width="200" src="https://weeklyosm.eu/wp-content/uploads/2019/05/adoptOpenJDK.jpg" alt="professor woshingo"/>

This repo shows how to connect to MongoDB using the official Java driver.

There are two version of this library, the one who implements non blocking
[reactive streams](http://www.reactive-streams.org/), and the sync (blocking)
one. We've chosen the reactive.

Resources used:

- Official Java driver documentation: <https://www.mongodb.com/docs/drivers/java/>
- Java installation for MongoDB: <https://mongodb.github.io/mongo-java-driver/4.9/driver-reactive/getting-started/installation/>
- Connecting to MongoDB with Java Course: <https://learn.mongodb.com/learn/course/connecting-to-mongodb-in-java>
- The reactive driver Java docs: <https://mongodb.github.io/mongo-java-driver/4.9/driver-reactive>

---

## About the data

The `sample_woshingo` database queried here contains the complete list of
videos of the Mexican youtuber [Woshingo](https://www.youtube.com/@Woshingo), scrapped using [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## About the main dependency

The MongoDB driver dependency is defined in the [pom.toml](pom.xml).

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-reactivestreams</artifactId>
    <version>4.9.0</version>
</dependency>
```

## Running the code

First you will need a running MongoDB cluster. You can use a local instance or
preferably deploy a free tier cluster in the cloud using MongoDB Atlas.

We've used [maven](https://maven.apache.org/) as project builder and dependecies
manager. You can install it with its
[5 minutes guide](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html).

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
mvn compile -X exec:java -D exec.mainClass=com.mongojava.app.App
```

## Results

Here we print the full list of Woshingo videos, picking only the properties that interest us.

https://github.com/GNUfamilia-fisi/mongodb-connections/assets/98111143/a9ba1de0-f23d-472a-b5d3-138ddba3becb
