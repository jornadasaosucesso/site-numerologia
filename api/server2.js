// api/server2.js - mudar para server.js no final dos testes.... 16:20 - gravado tbem no server09.js
import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import gravarPagamento from "./gravar_pagamento.js";
import checkPagamento from "./routes/check_pagamento.js";
import statusPagamentoRoute from "../routes/status_pagamento.js";

import { fileURLToPath } from "url"; // CRÍTICO!


dotenv.config();

// 🛑 ADICIONE ESTAS DUAS LINHAS AGORA:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// 🛑 FIM DA ADIÇÃO


// ----------------------------------------------------
// 1. CONFIGURAÇÃO BASE
// ----------------------------------------------------
const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, '..')));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ----------------------------------------------------
// 2. CONEXÃO COM O BANCO DE DADOS
// ----------------------------------------------------
const client = new MongoClient(process.env.DB_URI);
let pagamentosCollection;

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ Mongoose conectado"))
  .catch((err) => console.error("❌ Erro ao conectar Mongoose:", err));

client
  .connect()
  .then(() => {
    const db = client.db(process.env.DB_NAME);
    pagamentosCollection = db.collection("pagamentos");
    console.log("✅ Conectado ao MongoDB Atlas e Collection 'pagamentos' pronta.");
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao MongoDB (MongoClient):", err);
  });

// ----------------------------------------------------
// 3. ROTAS EXTERNAS
// ----------------------------------------------------
app.use("/api/gravar_pagamento", gravarPagamento);
app.use("/api", checkPagamento);
app.use("/api/status-pagamento", statusPagamentoRoute);

console.log("✅ Rotas principais registradas.");

// ----------------------------------------------------
// 4. FUNÇÕES UTILITY
// ----------------------------------------------------
function gerarIdUnico(nome, data) {
  const base = `${(nome || "").trim().toLowerCase()}|${(data || "").trim()}`;
  return crypto.createHash("sha1").update(base).digest("hex");
}

// ----------------------------------------------------
// 5. ROTAS MERCADO PAGO E CHECKS
// ----------------------------------------------------
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const MP_BASE = MP_ACCESS_TOKEN.startsWith("TEST-")
  ? "https://api.mercadopago.com/sandbox"
  : "https://api.mercadopago.com";

// Rota: create_pix
app.post("/api/create_pix", async (req, res) => {
  try {
    const { nome, data_nascimento, amount = 1.0 } = req.body;
    const r = await fetch(`${MP_BASE}/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        transaction_amount: parseFloat(amount),
        description: "Pagamento Numerologia",
        payment_method_id: "pix",
        payer: {
          email: "cliente@example.com",
          first_name: nome,
        },
        metadata: { nome, data_nascimento },
      }),
    });

    const json = await r.json();
    if (!r.ok) return res.status(500).json({ error: "error_from_mercadopago", detalhes: json });

    const tdata = json.point_of_interaction?.transaction_data || {};
    res.json({
      payment_id: json.id,
      status: json.status,
      qr_code: tdata.qr_code || null,
      qr_code_base64: tdata.qr_code_base64 || null,
      pix_copy: tdata.qr_code || null,
      id_unico: gerarIdUnico(nome, data_nascimento),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
});

// Rota: check_payment
app.get("/api/check_payment", async (req, res) => {
  try {
    const payment_id = req.query.payment_id;
    const r = await fetch(`${MP_BASE}/v1/payments/${payment_id}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });

    const json = await r.json();
    if (!r.ok) return res.status(500).json({ error: "error_from_mercadopago", detalhes: json });

    if (json.status === "approved") {
      const id_unico =
        json.metadata?.id_unico ||
        gerarIdUnico(json.metadata?.nome, json.metadata?.data_nascimento);
      const registro = {
        id_unico,
        nome: json.metadata?.nome,
        data_nascimento: json.metadata?.data_nascimento,
        valor: json.transaction_amount,
        status: "pago",
        paid: true,
        atualizado_em: new Date(),
      };
      const existente = await pagamentosCollection.findOne({ id_unico });
      if (!existente) await pagamentosCollection.insertOne(registro);
    }

    res.json({ id: json.id, status: json.status, detail: json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
});

// Rota: has_paid
app.get("/api/has_paid", async (req, res) => {
  try {
    const { id_unico } = req.query;
    if (!id_unico) return res.status(400).json({ error: "id_unico required" });

    const found = await pagamentosCollection.findOne({ id_unico });
    const isPaid = found && found.paid === true;
    res.json({ paid: isPaid, registro: found || null });
  } catch (err) {
    console.error("Erro na consulta has_paid:", err);
    res.status(500).json({ error: "internal" });
  }
});

// Rota: verifica-pagamento
app.get("/verifica-pagamento", async (req, res) => {
  const { nome, data_nascimento } = req.query;
  if (!nome || !data_nascimento)
    return res.status(400).json({ erro: "Nome e data de nascimento são obrigatórios." });

  try {
    const resultado = await pagamentosCollection.findOne({ nome, data_nascimento });
    if (resultado) {
      res.json({ pago: resultado.paid, id_unico: resultado.id_unico });
    } else {
      res.json({ pago: false, erro: "Registro não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar no banco:", err);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

// Rota: /api/check/:id_unico (para suportar o frontend)
app.get("/api/check/:id_unico", async (req, res) => {
    try {
        const { id_unico } = req.params; // Captura o ID da URL
        if (!id_unico) return res.status(400).json({ error: "id_unico required" });

        const found = await pagamentosCollection.findOne({ id_unico });
        
        // Simplesmente retorna o status e se foi pago, como o frontend espera
        const isPaid = found && found.paid === true;
        
        // O frontend espera { success: true/false, paid: true/false }
        res.json({ success: true, paid: isPaid, registro: found || null }); 

    } catch (err) {
        console.error("Erro na consulta /api/check/:id_unico:", err);
        res.status(500).json({ error: "internal" });
    }
});

// ----------------------------------------------------
// 6. INICIA O SERVIDOR
// ----------------------------------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
