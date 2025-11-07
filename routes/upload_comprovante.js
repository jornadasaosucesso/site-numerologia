const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Comprovante = require('./models/Comprovante'); // modelo MongoDB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = req.body.nome || 'user';
    const txid = req.body.txid || 'txid';
    cb(null, `${nome}_${txid}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/api/upload_comprovante', upload.single('comprovante'), async (req, res) => {
  const { nome, data_nascimento, txid } = req.body;
  const id_unico = crypto.createHash('sha1').update(`${nome.trim().toLowerCase()}|${data_nascimento}`).digest('hex');

  const novo = new Comprovante({
    id_unico,
    nome,
    data_nascimento,
    txid,
    status: 'aguardando',
    comprovante_path: req.file.path,
    criado_em: new Date()
  });

  await novo.save();
  res.json({ ok: true, message: 'Comprovante recebido com sucesso!' });
});

module.exports = router;