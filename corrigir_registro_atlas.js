const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function corrigirRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const resultado = await pagamentos.updateOne(
      { nome: "antonio", data_nascimento: "10112010" },
      {
        $set: {
          nome: "Silmara Correa",
          id_unico: "e3366392201bf834519f7a932dde628d80432328"
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