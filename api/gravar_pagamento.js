import express from "express";
import crypto from "crypto";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// 🔹 Conexão com o MongoDB
const client = new MongoClient(process.env.DB_URI);
let pagamentosCollection = null;

client.connect()
  .then(() => {
    const db = client.db(process.env.DB_NAME);
    pagamentosCollection = db.collection("pagamentos");
    console.log("✅ MongoDB: Conexão estabelecida e collection 'pagamentos' pronta.");
  })
  .catch(err => {
    console.error("❌ MongoDB: Erro ao conectar:", err);
  });

// CORREÇÃO PARA gravar_pagamento.js
function gerarIdUnico(nome, data) {
  const nomeLimpo = nome
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim(); // 👈 ADICIONE ESTE .trim() FINAL!

  const dataLimpa = data.replace(/\D/g, "");
  const base = `${nomeLimpo}|${dataLimpa}`;
  return crypto.createHash("sha1").update(base).digest("hex");
}

// ======================================================
// 🔹 POST /api/gravar_pagamento - CORREÇÃO FINAL
// ======================================================

router.post("/", async (req, res) => {
    try {
        console.log("📥 Recebendo requisição em /api/gravar_pagamento");
        
        // 🚨 CRÍTICO: RECEBER E VALIDAR AS VARIÁVEIS AQUI DENTRO!
        const { nome, data, valor, txid, paid, status } = req.body; 

        if (!nome || !data || !valor || !txid) {
            return res.status(400).json({ erro: "Campos obrigatórios ausentes" });
        }

        const id_unico = gerarIdUnico(nome, data);
        console.log("🔑 ID único gerado:", id_unico);

        const query = { id_unico: id_unico };

        // 2. Definir os dados para atualização/inserção (UPSERT)
        const updateData = {
            $set: {
                nome: nome, 
                data_nascimento: data, 
                valor: valor,
                txid: txid, 
                paid: typeof paid === 'boolean' ? paid : false, 
                status: status || "pendente", 
            },
            // Garante que a data de criação seja definida apenas no primeiro registro (inserção)
            $setOnInsert: { 
                data_criacao: new Date()
            }
        };

        // 3. Executa o UPSERT (Cria ou Atualiza)
        const result = await pagamentosCollection.updateOne(
            query,
            updateData,
            { upsert: true }
        );

        console.log("💾 Pagamento registrado/atualizado com sucesso. Resultado:", result.upsertedId || result.modifiedCount);

        res.json({
            success: true,
            mensagem: "Pagamento registrado/atualizado com sucesso",
            id_unico
        });

    } catch (erro) {
        console.error("❌ Erro ao gravar/atualizar pagamento:", erro);
        res.status(500).json({ success: false, erro: "Falha interna ao gravar pagamento" });
    }
});


// ======================================================
// 🔹 GET /api/check/:idUnico
// ======================================================
router.get("/check/:idUnico", async (req, res) => {
  if (!pagamentosCollection) {
    return res.status(503).json({
      success: false,
      paid: false,
      message: "Serviço indisponível (BD não conectado)."
    });
  }

  const { idUnico } = req.params;
  console.log(`[GET] Consulta de pagamento para ID: ${idUnico}`);

  try {
    let usuario;

    if (idUnico && idUnico.length < 30) {
      usuario = await pagamentosCollection.findOne({ txid: idUnico });
      console.log("DEBUG: Busca via TXID.");
    } else {
      usuario = await pagamentosCollection.findOne({ id_unico: idUnico });
      console.log("DEBUG: Busca via HASH LONGO.");
    }

    if (!usuario) {
      return res.json({ success: true, paid: false, message: "ID não registrado." });
    }

    const isPaid = usuario.status === "pago";

    if (isPaid) {
      console.log(`✅ Pagamento confirmado para ID ${idUnico}.`);
      return res.json({ success: true, paid: true, message: "Pagamento confirmado." });
    } else {
      console.log(`⚠️ Pagamento pendente para ID ${idUnico}.`);
      return res.json({ success: true, paid: false, message: "Pagamento pendente." });
    }

  } catch (error) {
    console.error("❌ Erro ao consultar o MongoDB:", error);
    res.status(500).json({ success: false, paid: false, message: "Erro interno do servidor." });
  }
});

export default router;
