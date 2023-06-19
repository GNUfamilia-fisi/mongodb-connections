val scala3Version = "3.3.0"

lazy val root = project
  .in(file("."))
  .settings(
    name := "scala",
    version := "0.1.0-SNAPSHOT",

    scalaVersion := scala3Version,

    libraryDependencies += "org.scalameta" %% "munit" % "0.7.29" % Test,
    libraryDependencies += ("org.mongodb.scala" %% "mongo-scala-driver" % "4.3.3").cross(CrossVersion.for3Use2_13),
  )

resolvers ++= Seq(Classpaths.typesafeReleases)

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.4.2",
)
