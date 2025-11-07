// /api/models/comprovantes.js
import mongoose from "mongoose";

const comprovanteSchema = new mongoose.Schema({
  id_unico: {
    type: String,
    required: true,
    index: true,
  },
  nome: {
    type: String,
    required: true,
  },
  data_nascimento: {
    type: String,
    required: true,
  },
  txid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["aguardando", "pago", "invalido"],
    default: "aguardando",
  },
  comprovante_path: {
    type: String,
    required: true,
  },
  criado_em: {
    type: Date,
    default: Date.now,
  },
});

// 👇 Aqui é a diferença principal:
const Comprovante = mongoose.model("Comprovante", comprovanteSchema);
export default Comprovante;

