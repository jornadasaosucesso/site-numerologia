const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('comprovante'), async (req, res) => {
  try {
    const { txidEsperado, valorEsperado } = req.body;
    const comprovante = req.file;

    if (!comprovante) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }


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
      nomeArquivo: comprovante.originalname,
      tamanho: comprovante.size,
      mimetype: comprovante.mimetype,
      txid: resultadoOCR.txid,
      valor: resultadoOCR.valor,
      dataHora: resultadoOCR.dataHora,
      valido
    });
  } catch (err) {
    console.error('Erro na validação do comprovante:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;


