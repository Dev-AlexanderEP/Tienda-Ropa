import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import {
  CreatePagoMercadoPagoBodySchema,
  CreatePagoPayPalBodySchema,
  CapturarPagoPayPalBodySchema,
  PagoPayPalIniciadoSchema,
  MetodoPagoResponseSchema,
  PagoResponseSchema,
} from "../dto/pago.schema";

const METODO_PAGO_BASE = `${API_BASE_BASE}/api/MetodoPago`;
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

export const createPagoMercadoPago = (body) => {
  const payload = CreatePagoMercadoPagoBodySchema.parse(body);
  return axios
    .post(`${PAGO_BASE}/mercadopago`, payload, { headers: authHeaders() })
    .then((r) => PagoResponseSchema.parse(r.data.data));
};

export const getPaypalClientToken = () =>
  axios
    .get(`${PAGO_BASE}/paypal/client-token`, { headers: authHeaders() })
    .then((r) => r.data.data);

export const createPagoPaypal = (body) => {
  const payload = CreatePagoPayPalBodySchema.parse(body);
  return axios
    .post(`${PAGO_BASE}/paypal`, payload, { headers: authHeaders() })
    .then((r) => PagoPayPalIniciadoSchema.parse(r.data.data));
};

export const capturarPagoPaypal = (body) => {
  const payload = CapturarPagoPayPalBodySchema.parse(body);
  return axios
    .post(`${PAGO_BASE}/paypal/capturar`, payload, { headers: authHeaders() })
    .then((r) => PagoResponseSchema.parse(r.data.data));
};
