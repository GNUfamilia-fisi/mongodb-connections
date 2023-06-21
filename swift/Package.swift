// swift-tools-version:5.1
import PackageDescription

let package = Package(
    name: "Main",
    platforms: [
        .macOS(.v10_15),
    ],
    dependencies: [
        .package(
            url: "https://github.com/mongodb/mongo-swift-driver",
            .upToNextMajor(from: "1.3.1")
        )
    ],
    targets: [
        // Async module
        .target(name: "Main", dependencies: ["MongoSwift"]),
    ]
)
