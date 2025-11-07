const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.DB_URI);

async function apagarRegistros() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const pagamentos = db.collection('pagamentos');

    const resultado = await pagamentos.deleteMany({
      id_unico: {
        $in: [
          "7ed90502ccb61251900bf5f97579d6276cd9f5d9" // Jorge
        ]
      }
    });

    console.log(`🧹 Registros apagados: ${resultado.deletedCount}`);
  } catch (err) {
    console.error("❌ Erro ao apagar:", err);
  } finally {
    await client.close();
  }
}

apagarRegistros();