// server.js
const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-6194c127-45df-4912-a085-cc842eb2b63f';
const PAGAMENTOS_FILE = path.join(__dirname, 'api', 'pagamentos.json');

// garante arquivo de pagamentos
if (!fs.existsSync(path.dirname(PAGAMENTOS_FILE))) fs.mkdirSync(path.dirname(PAGAMENTOS_FILE), { recursive: true });
if (!fs.existsSync(PAGAMENTOS_FILE)) fs.writeFileSync(PAGAMENTOS_FILE, '[]', 'utf8');

// util: gera id unico baseado em nome+data
function gerarIdUnico(nome, data) {
  const base = `${(nome||'').trim().toLowerCase()}|${(data||'').trim()}`;
  return crypto.createHash('sha1').update(base).digest('hex');
}

// rota para criar pagamento (PIX) usando Mercado Pago (payments API)
app.post('/api/create_pix', async (req, res) => {
  try {
    const { nome, data_nascimento, amount = 1.00 } = req.body;
    const id_unico = gerarIdUnico(nome, data_nascimento);
    const body = {
      transaction_amount: parseFloat(amount) || 1.00,
      description: `Consulta Numerológica - ${nome || "Usuário"}`,
      payment_method_id: "pix",
      payer: {
        email: (req.body.email || 'cliente_teste@exemplo.com')
      },
      metadata: { nome, data_nascimento, id_unico }
    };

    const r = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const json = await r.json();
    if (!r.ok) {
      console.error('MP error create:', json);
      return res.status(500).json({ error: 'error_from_mercadopago', detalhes: json });
    }

    // tenta extrair qr e qr_base64
    const tdata = json.point_of_interaction?.transaction_data || {};
    const qr_text = tdata.qr_code || null;
    const qr_base64 = tdata.qr_code_base64 || null;

    // Retorna dados p/ frontend
    res.json({
      payment_id: json.id,
      status: json.status,
      qr_code: qr_text,
      qr_code_base64: qr_base64,
      pix_copy: tdata.qr_code || null,
      id_unico
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// rota para checar pagamento
app.get('/api/check_payment', async (req, res) => {
  try {
    const payment_id = req.query.payment_id;
    if (!payment_id) return res.status(400).json({ error: 'payment_id required' });

    const r = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
    });
    const json = await r.json();
    if (!r.ok) return res.status(500).json({ error: 'error_from_mercadopago', detalhes: json });

    // se aprovado, grava em pagamentos.json
    if (json.status === 'approved') {
      const id_unico = json.metadata?.id_unico || gerarIdUnico(json.metadata?.nome, json.metadata?.data_nascimento);
      const registro = {
        id_unico,
        payment_id: json.id,
        nome: json.metadata?.nome || '',
        data_nascimento: json.metadata?.data_nascimento || '',
        valor: json.transaction_amount || 0,
        data_pagamento: new Date().toISOString()
      };
      // salva no arquivo (adiciona único)
      const content = JSON.parse(fs.readFileSync(PAGAMENTOS_FILE, 'utf8') || '[]');
      if (!content.find(x => x.id_unico === id_unico)) {
        content.push(registro);
        fs.writeFileSync(PAGAMENTOS_FILE, JSON.stringify(content, null, 2), 'utf8');
      }
    }

    res.json({ id: json.id, status: json.status, detail: json });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// rota para checar se id_unico já pagou (frontend pode usar)
app.get('/api/has_paid', (req, res) => {
  try {
    const { id_unico } = req.query;
    if (!id_unico) return res.status(400).json({ error: 'id_unico required' });
    const content = JSON.parse(fs.readFileSync(PAGAMENTOS_FILE, 'utf8') || '[]');
    const found = content.find(x => x.id_unico === id_unico);
    res.json({ paid: !!found, registro: found || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
