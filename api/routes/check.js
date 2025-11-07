// /api/routes/check.js

const express = require('express');
const router = express.Router();
// Certifique-se de importar seu objeto de conexão com o MongoDB (ex: mongoose, db, etc.)
const { db } = require('../server'); // Se o 'db' for exportado do server.js

// 🚨 ROTA CORRIGIDA PARA USAR GET E RECEBER O ID ÚNICO COMO PARÂMETRO 🚨
router.get('/:id_unico', async (req, res) => {
    // Captura o ID Único da URL
    const idUnico = req.params.id_unico;
    
    if (!idUnico) {
        return res.status(400).json({ success: false, paid: false, message: "ID Único ausente." });
    }

    try {
        // Assume que 'db' é o objeto de conexão MongoDB/Mongoose
        // e que 'pagamentos' é o nome da sua collection
        const pagamento = await db.collection('pagamentos').findOne({ id_unico: idUnico });

        if (pagamento) {
            console.log(`[CHECK] Usuário encontrado: ${pagamento.nome}. Paid: ${pagamento.paid}`);
            
            // Retorna o status de pagamento
            return res.json({ 
                success: true,
                paid: pagamento.paid, // Retorna true ou false lido do DB
                message: "Status de pagamento verificado com sucesso." 
            });
        } else {
            // Se o ID Único não for encontrado
            return res.status(404).json({ 
                success: false, 
                paid: false, 
                message: "Registro não encontrado para este ID." 
            });
        }

    } catch (error) {
        console.error("Erro na checagem de pagamento no DB:", error);
        return res.status(500).json({ success: false, paid: false, message: "Erro interno do servidor." });
    }
});

module.exports = router;