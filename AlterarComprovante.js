const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.DB_URI);

async function atualizarPagamento() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const pagamentos = db.collection('pagamentos');

    const resultado = await pagamentos.updateOne(
      { _id: new ObjectId("690a6cbfd1418b294b50cb02") },
      {
        $set: {
          data_nascimento: "26051955",
          valor: 35.00,
          status: "pago",
          id_unico: "3dc29c59574d7a57d0a74b02e53f7075ed49cb9e",
          payment_id: "MATEJDY93N",
          data_pagamento: new Date("2025-11-06T21:24:04.798Z")
        }
      }
    );

    if (resultado.modifiedCount === 1) {
      console.log("✅ Registro atualizado com sucesso!");
    } else {
      console.log("⚠️ Nenhum registro foi modificado. Verifique o _id.");
    }
  } catch (err) {
    console.error("❌ Erro ao atualizar:", err);
  } finally {
    await client.close();
  }
}

atualizarPagamento();