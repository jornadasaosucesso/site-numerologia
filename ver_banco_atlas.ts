const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verConteudo() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const todos = await pagamentos.find({}).limit(10).toArray();
    console.log("📦 Registros encontrados:");
    console.table(todos);
  } catch (err) {
    console.error("❌ Erro ao acessar o banco:", err);
  } finally {
    await client.close();
  }
}

verConteudo();