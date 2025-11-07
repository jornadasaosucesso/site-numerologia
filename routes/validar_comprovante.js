// site-numerologia/routes/validar_comprovante.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('comprovante'), async (req, res) => {
  try {
    // 1. EXTRAIR TODOS OS DADOS NECESSÁRIOS DO FRONTEND
    const { 
        txidEsperado, 
        valorEsperado, 
        // Adicionando o ID Único aqui, que é crucial para o DB
        id_unico, 
        nome, 
        data_nascimento 
    } = req.body;
    
    const comprovante = req.file;

    if (!comprovante) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }

    // --- BLOCO DE OCR REAL IRIA AQUI (MANTIDO SIMULADO POR ENQUANTO) ---
    // Apenas para manter o fluxo funcionando e resolver a inconsistência de dados:
    const resultadoOCR = {
      txid: txidEsperado,
      valor: valorEsperado,
      dataHora: new Date().toISOString()
    };
    // --------------------------------------------------------------------

    const valido = {
      txid: resultadoOCR.txid === txidEsperado,
      valor: parseFloat(resultadoOCR.valor) === parseFloat(valorEsperado)
    };

    // 2. ADICIONAR OS DADOS DO USUÁRIO AO JSON DE RESPOSTA
    // O frontend (pix_12.html) precisa desses dados para passar adiante na gravação final.
    res.json({
      nomeArquivo: comprovante.originalname,
      tamanho: comprovante.size,
      mimetype: comprovante.mimetype,
      txid: resultadoOCR.txid,
      valor: resultadoOCR.valor,
      dataHora: resultadoOCR.dataHora,
      valido,
        // DADOS ADICIONAIS NECESSÁRIOS PARA A GRAVAÇÃO FINAL DO PAGAMENTO:
        id_unico,
        nome, 
        data_nascimento 
    });

  } catch (err) {
    console.error('Erro na validação do comprovante:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;