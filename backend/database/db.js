const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);
let db;

async function connectToMongo() {
  try {
    console.log(uri)
    console.log(dbName)
    await client.connect();
    db = client.db(dbName);
    console.log(`connected to mongodb ${dbName}`)
  } catch (err) {
    console.log(`connection error: ${err}`)
  }
}

function getDb() {
  if (!db) {
    throw new Error('Call connectToMongo before getting db!')
  }
  return db;
}

module.exports = {
  connectToMongo, getDb
}