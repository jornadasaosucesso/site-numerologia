const express = require('express');
const router = express.Router();

// 🧩 aumenta o limite de payload aqui também
router.use(express.json({ limit: '100mb' }));
router.use(express.urlencoded({ extended: true, limit: '100mb' }));

router.post('/', async (req, res) => {
  try {
    const { comprovante_base64, txidEsperado, valorEsperado } = req.body;

    if (!comprovante_base64) {
      return res.status(400).json({ erro: 'Comprovante não enviado.' });
    }

    // 🔍 Simulação de OCR — pode substituir por OCR real
    const resultadoOCR = {
      txid: txidEsperado,
      valor: valorEsperado,
      dataHora: new Date().toISOString()
    };

    const valido = {
      txid: resultadoOCR.txid === txidEsperado,
      valor: parseFloat(resultadoOCR.valor) === parseFloat(valorEsperado)
    };

    res.json({
      status: 'ok',
      txid: resultadoOCR.txid,
      valor: resultadoOCR.valor,
      dataHora: resultadoOCR.dataHora,
      valido
    });

  } catch (err) {
    console.error('❌ Erro em /api/validar-comprovante:', err);
    res.status(500).json({ erro: 'Falha ao validar comprovante' });
  }
});

module.exports = router;