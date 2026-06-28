import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import { MetodoPagoResponseSchema, PagoResponseSchema } from "../dto/pago.schema";

const METODO_PAGO_BASE = `${API_BASE_BASE}/api/metodo-pago`;
const PAGO_BASE = `${API_BASE_BASE}/api/pago`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getMetodosPago = () =>
  axios
    .get(METODO_PAGO_BASE, { headers: authHeaders() })
    .then((r) => MetodoPagoResponseSchema.array().parse(r.data.data ?? []));

export const createPago = (ventaId, metodoId) =>
  axios
    .post(PAGO_BASE, { ventaId, metodoId }, { headers: authHeaders() })
    .then((r) => PagoResponseSchema.parse(r.data.data));
