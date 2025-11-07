const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function buscarPorId() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const resultado = await pagamentos.findOne({
      id_unico: "099dc5bb19bc93efd7a956b8f334eb3044cf1457"
    });

    console.log("🔍 Resultado da busca:");
    console.log(resultado);
  } catch (err) {
    console.error("❌ Erro ao buscar:", err);
  } finally {
    await client.close();
  }
}

buscarPorId();