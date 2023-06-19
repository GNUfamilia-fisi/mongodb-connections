<?php
require 'vendor/autoload.php'; // include Composer's autoloader

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new MongoDB\Client($_ENV['MONGO_URI']);
$db_name = $_ENV['DB_NAME'];
$db_collection = $_ENV['DB_COLLECTION'];

$collection = $client->$db_name->$db_collection;
// Remove previous indexes
$collection->dropIndexes();

// https://www.mongodb.com/docs/manual/core/index-compound/
$compound_index = ['title' => 'text', 'view_count' => 1];
$collection->createIndex($compound_index);

echo "Search for woshingo videos\n";
echo "Press Ctrl+C to finish\n\n";

while (true) {
    $input = readline("> ");

    $filter = [ '$text' => [ '$search' => $input ] ];
    $result = $collection->find($filter);

    foreach ($result as $entry) {
        echo ' - ', $entry['title'], ': ', $entry['url'], "\n";
    }
    echo "\n";
}
