const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function inserirRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const resultado = await pagamentos.insertOne({
      id_unico: "85a75d003258117dd6c33c2fdfe24ceeb5517be7",
      nome: "Marcia Carla da Costa Viana",
      data_nascimento: "16041961",
      paid: true
    });

    console.log("✅ Registro inserido com sucesso:", resultado.insertedId);
  } catch (err) {
    console.error("❌ Erro ao inserir:", err);
  } finally {
    await client.close();
  }
}

inserirRegistro();