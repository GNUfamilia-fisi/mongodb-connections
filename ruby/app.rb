#!/usr/bin/ruby
require 'mongo'

Mongo::Logger.logger.level = ::Logger::FATAL

client = Mongo::Client.new(
  ENV['MONGO_URI'] || 'mongodb://localhost:27017',
  :database => ENV['DB_NAME'] || 'woshingo'
)

# client.collections.each { |coll| puts coll.name }
DB_COLLECTION = ENV['DB_COLLECTION']

# check if collection exists
puts 'Browsing collections'
collection_exists = client.collections.any? do |coll|
  puts '- ' << coll.name
  coll.name == DB_COLLECTION
end

if not collection_exists
  puts 'Collection does not exist, creating'
  client.create_collection(DB_COLLECTION)
end

woshingo_videos = client.database.collection(DB_COLLECTION)

found_videos = woshingo_videos.find({}).to_a

puts 'Found videos:'
found_videos.each do |video|
  puts '🍃 ' << video['title'] << "\n   " << video['url'] << "\n\n"
end

client.close
