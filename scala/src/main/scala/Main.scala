import org.mongodb.scala._
import com.mongodb.{ServerApi, ServerApiVersion}
import org.mongodb.scala.{ConnectionString, MongoClient, MongoClientSettings}
import org.mongodb.scala.bson.Document
import scala.concurrent.Await
import scala.concurrent.duration.DurationInt
import scala.util.Using
import docs_helpers.Helpers.DocumentObservable

class MongoDB():
  def connect(mongo_uri: String) =
    println("hello world....")

@main def app: Unit = {
  // Replace the placeholder with your Atlas connection string
  val connectionString = "mongodb+srv://pandadiestro:rojoalsa1@hola-cluster.ll5kqmh.mongodb.net"
  // Construct a ServerApi instance using the ServerApi.builder() method
  val serverApi = ServerApi.builder.version(ServerApiVersion.V1).build()
  val settings = MongoClientSettings
    .builder()
    .applyConnectionString(ConnectionString(connectionString))
    .serverApi(serverApi)
    .build()

  println("\n\nConnecting to MongoDB")
  // Create a new client and connect to the server
  Using(MongoClient(settings)) { client =>
    // Send a ping to confirm a successful connection
    val database = client.getDatabase("sample_woshingo")
    val collection = database.getCollection("metadata")

    val woshingo_videos = Await.result(
      collection.find().toFuture(), 10.seconds
    )

    for video <- woshingo_videos do
      println(video.getString("title"))
  }
}
