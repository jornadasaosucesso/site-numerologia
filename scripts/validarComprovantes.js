// scripts/validarComprovantes.js
const mongoose = require('mongoose');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const Comprovante = require('../models/Comprovante');

mongoose.connect('mongodb://localhost:27017/seuBanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function validarComprovantes() {
  const pendentes = await Comprovante.find({ status: 'aguardando' });

  for (const comp of pendentes) {
    try {
      const { comprovante_path, txid } = comp;
      const imagePath = path.resolve(comprovante_path);

      if (!fs.existsSync(imagePath)) {
        console.log(`Arquivo não encontrado: ${imagePath}`);
        continue;
      }

      const result = await Tesseract.recognize(imagePath, 'por', {
        logger: m => console.log(m.status)
      });

      const texto = result.data.text.toUpperCase();

      const txidEncontrado = texto.includes(txid.toUpperCase());
      const valorEncontrado = texto.includes('35,00') || texto.includes('R$35');
      const chaveEncontrada = texto.includes('F4246BE4') || texto.includes('EDE3-4535');

      if (txidEncontrado && valorEncontrado && chaveEncontrada) {
        comp.status = 'pago';
        console.log(`✅ Pagamento validado para ${comp.nome}`);
      } else {
        comp.status = 'invalido';
        console.log(`❌ Pagamento inválido para ${comp.nome}`);
      }

      await comp.save();
    } catch (err) {
      console.error(`Erro ao validar ${comp.nome}:`, err);
    }
  }

  mongoose.disconnect();
}

validarComprovantes();