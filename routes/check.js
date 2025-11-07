const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ status: '✅ Rota funcionando!', dadosRecebidos: req.body });
});

module.exports = router;