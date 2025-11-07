<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento via Pix - v4</title>

  <!-- Bibliotecas -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.4.2/sha.js"></script>

  <style>
    body {
      background: radial-gradient(circle at center, #000, #111);
      color: #fff;
      font-family: 'Playfair Display', serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }

    h2 { color: gold; margin-bottom: 8px; }

    #qrcode {
      margin: 20px 0;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 0 20px rgba(255,215,0,0.4);
      background: #fff;
    }

    #pixCode {
      background: #111;
      border: 1px solid gold;
      color: #fff;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      padding: 10px;
      font-size: 0.9em;
    }

    button {
      margin-top: 18px;
      background: linear-gradient(90deg,#ffd700,#ffae42);
      color: #000;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      padding: 10px 24px;
      cursor: pointer;
      font-size: 1em;
      transition: 0.3s;
    }

    button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255,220,100,0.8);
    }

    .erro { color: #ff5555; font-weight: bold; margin-top: 10px; }
    .sucesso { color: #90ee90; font-weight: bold; margin-top: 10px; }
  </style>
</head>

<body>
  <p style="font-size:1.6em; margin-bottom:12px; font-weight:bold;">ESTAMOS EM FASE DE TESTES!</p>
  <p style="font-size:1.6em; margin-bottom:12px; font-weight:bold;">⚠️ O SITE ESTARÁ ONLINE EM BREVE ⚠️</p>

  <h2>💰 Clique em "PIX PAGO" para validar seu pagamento</h2>
  <p>Escaneie o QR Code abaixo ou copie o código Pix para pagamento de R$ 35,00</p>

  <div id="qrcode"></div>
  <textarea id="pixCode" readonly>Escaneie o QR Code acima para pagamento</textarea>

  <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:18px;">
    <button id="btnGerar">Gerar Pix</button>
    <button id="copyBtn">Copiar Pix</button>
    <button id="btnPixPago">PIX PAGO</button>
    <button id="btnVoltar">Voltar</button>
  </div>

  <div id="mensagemPix" style="margin-top:15px; font-size:1em;"></div>

  <script>
    // ==============================
    // VARIÁVEIS BASE
    // ==============================
    const nome = localStorage.getItem("nome") || "Jorge Viana";
    const data = localStorage.getItem("data_nascimento") || "26/05/1955";
    const nomeDestinatario = "JORGEBARBOSAVIANA";
    const cidade = "CAMPOGRANDE";
    const valor = "35.00";
    const chavePix = "f4246be4-ede3-4535-8248-93acbe51c006";

    // ==============================
    // FUNÇÕES DE UTILIDADE
    // ==============================
    function gerarTXID(nome) {
      const clean = nome.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      return clean.substring(0, 4) + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function calcularCRC16(payload) {
      let polinomio = 0x1021, resultado = 0xFFFF;
      for (let i = 0; i < payload.length; i++) {
        resultado ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          resultado = (resultado & 0x8000)
            ? (resultado << 1) ^ polinomio
            : resultado << 1;
        }
        resultado &= 0xFFFF;
      }
      return resultado.toString(16).toUpperCase().padStart(4, '0');
    }

    function formatarCampo(id, valor) {
      const len = valor.length.toString().padStart(2, '0');
      return id + len + valor;
    }

    function sha1(str) {
      const shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(str);
      return shaObj.getHash("HEX");
    }

    function normalizarData(data) {
      return data.replace(/\D/g, '');
    }

    function gerarIdUnico(nome, data) {
      console.log("📥 Recebido nome:", nome);
      console.log("📥 Recebido data:", data);

      const nomeLimpo = (nome || '').trim().toLowerCase();
      const dataLimpa = normalizarData(data);

      console.log("🧼 Nome limpo:", nomeLimpo);
      console.log("🧼 Data limpa:", dataLimpa);

      const base = `${nomeLimpo}|${dataLimpa}`;
      const hash = sha1(base);

      console.log("🔑 Hash gerado:", hash);
      return hash;
    }

    // ==============================
    // VERIFICAR PAGAMENTO
    // ==============================
    function verificarPagamento() {
      const nome = localStorage.getItem("nome");
      const data = localStorage.getItem("data_nascimento");

      if (!nome || !data) {
        alert("❌ Dados ausentes. Retornando à tela inicial.");
        window.location.href = "escolha.html";
        return;
      }

      const id_unico = gerarIdUnico(nome, data);
      console.log("🔎 ID gerado:", id_unico);

      fetch(`/api/status_pagamento?id_unico=${id_unico}`)
        .then(res => res.json())
        .then(json => {
          console.log("📦 Resposta da API:", json);

          if (json.status === "pago") {
            alert("✅ Pagamento confirmado!");
          } else {
            alert("❌ Comprovante inválido ou não encontrado. Retornando à tela inicial.");
            window.location.href = "escolha.html";
          }
        })
        .catch(err => {
          console.error("❌ Erro ao verificar pagamento:", err);
          alert("❌ Erro ao verificar pagamento. Tente novamente.");
          window.location.href = "escolha.html";
        });
    }

    // ==============================
    // EVENTOS DE BOTÕES
    // ==============================
    document.getElementById("btnGerar").addEventListener("click", () => {
      const txid = gerarTXID(nome);

      const payload =
        formatarCampo("00", "01") +
        formatarCampo("26",
          formatarCampo("00", "BR.GOV.BCB.PIX") +
          formatarCampo("01", chavePix)
        ) +
        formatarCampo("52", "0000") +
        formatarCampo("53", "986") +
        formatarCampo("54", valor) +
        formatarCampo("58", "BR") +
        formatarCampo("59", nomeDestinatario) +
        formatarCampo("60", cidade) +
        formatarCampo("62", formatarCampo("05", txid));

      const payloadSemCRC = payload + "6304";
      const crc = calcularCRC16(payloadSemCRC);
      const brcode = payloadSemCRC + crc;

      document.getElementById("pixCode").value = brcode;

      QRCode.toDataURL(brcode, { width: 184 }).then(url => {
        const qrcodeDiv = document.getElementById("qrcode");
        qrcodeDiv.innerHTML = "";
        const img = document.createElement("img");
        img.src = url;
        img.alt = "QR Code para pagamento";
        qrcodeDiv.appendChild(img);
      });

      const chaveUsuario = normalizarData(data) + nome + txid;
      localStorage.setItem(chaveUsuario, JSON.stringify({
        nome,
        data_nascimento: data,
        txid,
        pago: false
      }));

      document.getElementById("mensagemPix").textContent = "✅ PIX Gerado com sucesso!";
    });

    document.getElementById("copyBtn").addEventListener("click", () => {
      const pixCode = document.getElementById("pixCode");
      pixCode.select();
      document.execCommand("copy");
      document.getElementById("mensagemPix").textContent = "📋 Código Pix copiado!";
    });

    document.getElementById("btnPixPago").addEventListener("click", verificarPagamento);

    document.getElementById("btnVoltar").addEventListener("click", () => {
      window.location.href = "escolha.html";
    });

    document.addEventListener("DOMContentLoaded", () => {
      verificarPagamento();
    });
  </script>
</body>
</html>
