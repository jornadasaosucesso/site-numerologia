// ✅ ./routes/check_pagamento.js — Versão ES Module

import express from "express"; // Mude 'require' para 'import'
const router = express.Router();
import Comprovante from "../models/comprovantes.js"; // Se Comprovante for ES Module, use '.js'

// 🔹 Função utilitária local (substitui a importação ausente verificarComprovante)
async function verificarComprovante(id_unico) {
  try {
    const registro = await Comprovante.findOne({ id_unico });
    return registro;
  } catch (erro) {
    console.error("Erro ao buscar comprovante:", erro);
    return null;
  }
}

// 🔹 Rota POST (verificação de pagamento com corpo JSON)
router.post("/", async (req, res) => {
  try {
    const { id_unico } = req.body;
    console.log("📦 Verificando pagamento (POST) para ID:", id_unico);

    const resultado = await verificarComprovante(id_unico);

    if (resultado) {
      res.json({ sucesso: true, mensagem: "Pagamento confirmado" });
    } else {
      res.json({ sucesso: false, mensagem: "Pagamento ainda não identificado" });
    }
  } catch (erro) {
    console.error("Erro ao verificar pagamento:", erro);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor" });
  }
});

// 🔹 Rota GET alternativa (usada se quiser checar via URL)
router.get("/check/:id_unico", async (req, res) => {
  try {
    const { id_unico } = req.params;
    console.log("🔍 Verificando pagamento (GET) para ID:", id_unico);

    const registro = await verificarComprovante(id_unico);

    if (!registro) {
      return res.status(404).json({
        success: false,
        paid: false,
        message: "Pagamento não encontrado",
      });
    }

    res.json({
      success: true,
      paid: registro.status === "pago",
      pagamento: registro,
    });
  } catch (err) {
    console.error("Erro ao verificar pagamento:", err);
    res.status(500).json({ success: false, paid: false, message: "Erro interno" });
  }
});


// 🔹 Exportação
export default router; // Mude 'module.exports = router' para 'export default router'
