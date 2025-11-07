import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Caminho completo do arquivo pagamentos.json
    const filePath = path.join(process.cwd(), 'api', 'pagamentos.json');

    // Lê o conteúdo atual (ou cria um array vazio)
    let data = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      data = raw ? JSON.parse(raw) : [];
    }

    // Adiciona o novo registro vindo do front-end (pix.html)
    const novoPix = {
      nome: req.body.nome,
      data_nascimento: req.body.data_nascimento,
      txid: req.body.txid,
      valor: req.body.valor,
      data_geracao: new Date().toISOString(),
      status: 'pendente',
    };

    data.push(novoPix);

    // Regrava o JSON atualizado
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    res.status(200).json({ ok: true, message: 'PIX registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar PIX:', error);
    res.status(500).json({ ok: false, error: 'Erro ao salvar o pagamento' });
  }
}
