// server.js
const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cors = require('cors');

require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let pagamentosCollection;

client.connect().then(() => {
  const db = client.db(process.env.DB_NAME);
  pagamentosCollection = db.collection('pagamentos');
  console.log("✅ Conectado ao MongoDB Atlas");
}).catch(err => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
});

const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));
app.use(cors()); // permite testes locais (ajuste em produção)

// LER TOKEN da variável de ambiente (NUNCA deixar em código em produção)
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || '';
if (!MP_ACCESS_TOKEN) {
  console.warn('[WARN] MP_ACCESS_TOKEN não definido — verifique suas credenciais.');
}

// Detecta se devemos usar sandbox (quando token começa com TEST-)
const isSandbox = String(MP_ACCESS_TOKEN).toUpperCase().startsWith('TEST-');
const MP_BASE = isSandbox ? 'https://api.mercadopago.com/sandbox' : 'https://api.mercadopago.com';

// arquivo onde gravamos registros locais de pagamentos aprovados
const PAGAMENTOS_FILE = path.join(__dirname, 'api', 'pagamentos.json');

// garante existência do arquivo
if (!fs.existsSync(path.dirname(PAGAMENTOS_FILE))) fs.mkdirSync(path.dirname(PAGAMENTOS_FILE), { recursive: true });
if (!fs.existsSync(PAGAMENTOS_FILE)) fs.writeFileSync(PAGAMENTOS_FILE, '[]', 'utf8');

// util: gera id unico baseado em nome+data
function gerarIdUnico(nome, data) {
  const base = `${(nome||'').trim().toLowerCase()}|${(data||'').trim()}`;
  return crypto.createHash('sha1').update(base).digest('hex');
}

// rota de debug (mostra token mascarado e ambiente)
app.get('/api/debug', (req, res) => {
  const masked = MP_ACCESS_TOKEN ? (MP_ACCESS_TOKEN.slice(0,6) + '...' + MP_ACCESS_TOKEN.slice(-4)) : null;
  res.json({ sandbox: isSandbox, token_masked: masked, mp_base: MP_BASE });
});

// rota para criar pagamento (PIX) usando Mercado Pago (payments API)
app.post('/api/create_pix', async (req, res) => {
  try {
    const { nome = '', data_nascimento = '', amount = 1.00, email = 'cliente_teste@exemplo.com' } = req.body;
    const id_unico = gerarIdUnico(nome, data_nascimento);

    const body = {
      transaction_amount: parseFloat(amount) || 1.00,
      description: `Consulta Numerológica - ${nome || "Usuário"}`,
      payment_method_id: "pix",
      payer: { email },
      metadata: { nome, data_nascimento, id_unico }
    };

    console.log('[API] create_pix -> payload:', JSON.stringify(body));

    const r = await fetch(`${MP_BASE}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const json = await r.json();
    console.log('[MP] create response status', r.status);
    if (!r.ok) {
      console.error('[MP] create error:', JSON.stringify(json, null, 2));
      return res.status(500).json({ error: 'error_from_mercadopago', detalhes: json, status: r.status });
    }

    // tenta extrair qr e qr_base64
    const tdata = json.point_of_interaction?.transaction_data || {};
    const qr_text = tdata.qr_code || null;
    const qr_base64 = tdata.qr_code_base64 || null;

    // resposta para frontend
    res.json({
      payment_id: json.id,
      status: json.status,
      qr_code: qr_text,
      qr_code_base64: qr_base64,
      pix_copy: qr_text || null,
      id_unico,
      raw: json
    });

  } catch (err) {
    console.error('[ERR create_pix]', err);
    res.status(500).json({ error: 'internal', message: err.message });
  }
});

// rota para checar pagamento
app.get('/api/check_payment', async (req, res) => {
  try {
    const payment_id = req.query.payment_id;
    if (!payment_id) return res.status(400).json({ error: 'payment_id required' });

    console.log('[API] check_payment ->', payment_id);
    const r = await fetch(`${MP_BASE}/v1/payments/${payment_id}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
    });
    const json = await r.json();
    console.log('[MP] check response status', r.status);

    if (!r.ok) {
      console.error('[MP] check error:', JSON.stringify(json, null, 2));
      return res.status(500).json({ error: 'error_from_mercadopago', detalhes: json, status: r.status });
    }

    // se aprovado, grava em pagamentos.json
    if (json.status === 'approved' || json.status === 'in_process') {
      const id_unico = json.metadata?.id_unico || gerarIdUnico(json.metadata?.nome, json.metadata?.data_nascimento);
      const registro = {
        id_unico,
        payment_id: json.id,
        nome: json.metadata?.nome || '',
        data_nascimento: json.metadata?.data_nascimento || '',
        valor: json.transaction_amount || 0,
        status: json.status,
        data_pagamento: new Date().toISOString()
      };
      const content = JSON.parse(fs.readFileSync(PAGAMENTOS_FILE, 'utf8') || '[]');
      if (!content.find(x => x.id_unico === id_unico)) {
        content.push(registro);
        fs.writeFileSync(PAGAMENTOS_FILE, JSON.stringify(content, null, 2), 'utf8');
        console.log('[DB] pagamento salvo ->', registro);
      } else {
        console.log('[DB] pagamento já existente para id_unico:', id_unico);
      }
    }

    res.json({ id: json.id, status: json.status, detail: json });

  } catch (err) {
    console.error('[ERR check_payment]', err);
    res.status(500).json({ error: 'internal', message: err.message });
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
    console.error('[ERR has_paid]', err);
    res.status(500).json({ error: 'internal', message: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT} (sandbox: ${isSandbox})`));

const statusPagamentoRoute = require('./routes/status_pagamento');
app.use('/api', statusPagamentoRoute);

