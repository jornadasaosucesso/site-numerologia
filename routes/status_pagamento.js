import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// 🔹 Configuração de __dirname (não existe em ESM por padrão)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Caminho do arquivo local de pagamentos
const PAGAMENTOS_FILE = path.join(__dirname, "..", "api", "pagamentos.json");

// ======================================================
// 🔹 GET /api/status_pagamento?id_unico=XXXXX
// ======================================================
router.get("/status_pagamento", async (req, res) => {
  const { id_unico } = req.query;

  if (!id_unico) {
    return res.status(400).json({ error: "ID não informado" });
  }

  try {
    console.log("🔍 Buscando comprovante com ID:", id_unico);

    // Lê o arquivo local de pagamentos
    const content = JSON.parse(
      fs.readFileSync(PAGAMENTOS_FILE, "utf8") || "[]"
    );
    const comp = content.find((x) => x.id_unico === id_unico);

    console.log("📦 Resultado da busca:", comp);

    if (!comp) {
      return res.json({ status: "invalido" });
    }

    return res.json({ status: comp.status });
  } catch (err) {
    console.error("❌ Erro ao consultar status:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
