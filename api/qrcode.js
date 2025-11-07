const fetch = require("node-fetch");

const MERCADO_PAGO_ACCESS_TOKEN = "TEST-6194c127-45df-4912-a085-cc842eb2b63f";

async function gerarPix(valor) {
  const url = "https://api.mercadopago.com/v1/payments";

  const body = {
    transaction_amount: valor,
    description: "Consulta de Numerologia",
    payment_method_id: "pix",
    payer: {
      email: "cliente_teste@example.com",
      first_name: "Teste",
      last_name: "Cliente",
      identification: {
        type: "CPF",
        number: "12345678909"
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

module.exports = { gerarPix };
