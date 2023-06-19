#
import requests
import json
import pprint
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


uri = "mongodb+srv://sebastiancueto:@cluster0.smvxozg.mongodb.net/?retryWrites=true&w=majority"

data={
}

def getInfo (i):
    url2 = f"https://stand-by-me.herokuapp.com/api/v1/stands/{i+1}"
    response=json.loads(requests.get(url2).text)#aca con .text luego vere el motivo
    data[i]=response
    pprint.pprint(response)
    return response


# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db= client["jojo stuff"]
    collection =db["stands"]
    for i in range (50):
        collection.insert_one(getInfo(i))
    results = collection.find() 
    for result in results:
        print (result)    
except Exception as e:
    print(e)
    
    
    
for i in range (50):
    getInfo(i)
    print ("\n")