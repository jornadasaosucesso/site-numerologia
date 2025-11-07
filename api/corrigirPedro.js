const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function corrigirRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const resultado = await pagamentos.updateOne(
      { nome: "Pedro De Tal", data_nascimento: "26/05/1955" },
      {
        $set: {
          nome: "Jorge Barbosa Viana",
          id_unico: "e6e3da4dbefaed042fc329c6b6db02db7dbfa1fc"
        }
      }
    );

    if (resultado.modifiedCount > 0) {
      console.log("✅ Registro atualizado com sucesso");
    } else {
      console.log("⚠️ Nenhum registro foi alterado");
    }
  } catch (err) {
    console.error("❌ Erro ao atualizar:", err);
  } finally {
    await client.close();
  }
}

corrigirRegistro();