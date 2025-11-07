db.pagamentos.updateOne(
  { _id: ObjectId("6906028f6586710a6042414a") },
  {
    $set: {
      data_nascimento: "26051955",
      valor: 35.00,
      status: "pago",
      payment_id: "JORGBV8XYZ",
      data_pagamento: new Date("2025-11-01T17:45:00.000Z")
    }
  }
)