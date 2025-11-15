import { MongoClient } from "mongodb";

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function inserirRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const resultado = await pagamentos.insertOne({
      id_unico: "e3366392201bf834519f7a932dde628d80432328",
      data_criacao: "2025-11-15T20:52:35.817Z",
      data_nascimento: "11011971",
      nome: "Silmara Correa",
      paid: true,
      status: "pago",
      txid: "SILMD8YFJC",
      valor: "26.00"
    });

    console.log("✅ Registro inserido com sucesso:", resultado.insertedId);
  } catch (err) {
    console.error("❌ Erro ao inserir:", err);
  } finally {
    await client.close();
  }
}

inserirRegistro();
