const { MongoClient } = require('mongodb');

async function listarCollections() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('siteNumerologia');
  const collections = await db.listCollections().toArray();
  
  console.log(collections.map(c => c.name));
  await client.close();
}

listarCollections();