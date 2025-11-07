const { MongoClient } = require('mongodb');

const uri = "sua_string_de_conexao";
const client = new MongoClient(uri);

async function alterarRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso.db");
    const pagamentos = db.collection("pagamentos");

    await pagamentos.updateOne(
      { nome: "Pedro de Tal" },
      { $set: { id_unico: "id_corrigido_aqui" } }
    );

    console.log("✅ Registro atualizado com sucesso");
  } catch (err) {
    console.error("❌ Erro ao atualizar:", err);
  } finally {
    await client.close();
  }
}

alterarRegistro();