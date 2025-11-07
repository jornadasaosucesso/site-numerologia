const { MongoClient } = require('mongodb');
const crypto = require('crypto');

function gerarIdUnico(nome, data_nascimento) {
  return crypto.createHash('sha1').update(nome + data_nascimento).digest('hex');
}

const uri = "mongodb+srv://jorgeviana2008_db_user:GOFlkEi2hSt3bAZ7@jornadasaosucesso-db.dfs7hsd.mongodb.net/jornadasaosucesso";
const client = new MongoClient(uri);

async function corrigirRegistro() {
  try {
    await client.connect();
    const db = client.db("jornadasaosucesso");
    const pagamentos = db.collection("pagamentos");

    const nomeAntigo = "Pedro de Tal";
    const dataNascimento = "26051955";
    const nomeNovo = "jorge barbosa viana";
    const novoIdUnico = gerarIdUnico(nomeNovo, dataNascimento);

    const resultado = await pagamentos.updateOne(
      { nome: nomeAntigo, data_nascimento: dataNascimento },
      { $set: { nome: nomeNovo, id_unico: novoIdUnico } }
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