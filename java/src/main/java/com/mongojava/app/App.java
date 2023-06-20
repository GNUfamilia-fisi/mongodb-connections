package com.mongojava.app;

import org.bson.Document;
import org.reactivestreams.Publisher;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import com.mongodb.ConnectionString;
import com.mongodb.reactivestreams.client.MongoClients;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoDatabase;
import com.mongodb.reactivestreams.client.MongoCollection;
import com.mongodb.MongoClientSettings;

public class App {
    public static void main(String[] args) {
        ConnectionString connString = new ConnectionString(
            System.getenv("MONGO_URI")
        );
        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(connString)
            .retryWrites(true)
            .build();

        MongoClient mongoClient = MongoClients.create(settings);
        MongoDatabase database = mongoClient.getDatabase(
            System.getenv("DB_NAME")
        );

        MongoCollection<Document> collection = database.getCollection(
            System.getenv("DB_COLLECTION")
        );
        Publisher<Document> documents = collection.find();

        documents.subscribe(new Subscriber<Document>() {
            @Override
            public void onSubscribe(Subscription subs) {
                System.out.println("Subscribed");
                // Request ALLLLL the data!!!!
                subs.request(Long.MAX_VALUE);
            }

            @Override
            public void onNext(Document video) {
                String title = video.getString("title");
                Integer duration = video.getInteger("duration");
                String url = video.getString("url");

                System.out.println(
                    String.format(
                        "%s (%d)\n%s\n",
                        title,
                        duration,
                        url
                    )
                );
            }

            @Override
            public void onError(Throwable err) {
                System.out.println("Error ☠️");
                err.printStackTrace();
            }

            @Override
            public void onComplete() {
                System.out.println("All woshingo videos fetched successfully 🎊");
            }
        });
    }
}
