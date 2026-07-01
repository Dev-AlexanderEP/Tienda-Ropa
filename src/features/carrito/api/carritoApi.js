import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import {
  AgregarCarritoItemParamsSchema,
  AplicarCuponSchema,
  CarritoItemDetalleResponseSchema,
  CarritoItemResponseSchema,
  CarritoResponseSchema,
  CreateCarritoItemBodySchema,
  StockParamsSchema,
  SumarStockParamsSchema,
  UpdateItemCantidadSchema,
} from "../dto/carrito.schema";

const CARRITOS_BASE = `${API_BASE_BASE}/api/carritos`;
const CARRITO_ITEMS_BASE = `${API_BASE_BASE}/api/CarritoItems`;
const PRENDA_TALLAS_BASE = `${API_BASE_BASE}/api/PrendaTallas`;
const DESCUENTO_CODIGOS_BASE = `${API_BASE_BASE}/api/DescuentoCodigos`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// ─── Carrito ─────────────────────────────────────────────────────────────────

// El usuarioId de la ruta es ignorado para CLIENTE — el backend usa el JWT
export const getCarritoAbierto = () =>
  axios
    .get(`${CARRITOS_BASE}/abierto/usuario/0`, { headers: authHeaders() })
    .then((r) => CarritoResponseSchema.array().parse(r.data.data ?? []));

export const getCarrito = (carritoId) =>
  axios
    .get(`${CARRITOS_BASE}/${carritoId}`, { headers: authHeaders() })
    .then((r) => CarritoResponseSchema.parse(r.data.data));

export const getCantidadItems = (carritoId) =>
  axios
    .get(`${CARRITOS_BASE}/${carritoId}/cantidad-items`, { headers: authHeaders() })
    .then((r) => r.data.data);

export const getCarritoItems = (carritoId) =>
  axios
    .get(`${CARRITO_ITEMS_BASE}/carrito/${carritoId}`, { headers: authHeaders() })
    .then((r) => CarritoItemDetalleResponseSchema.array().parse(r.data.data ?? []));

// usuarioId viene del JWT — no se envía body
export const createCarrito = () =>
  axios
    .post(CARRITOS_BASE, null, { headers: authHeaders() })
    .then((r) => CarritoResponseSchema.parse(r.data.data));

export const deleteCarrito = (carritoId) =>
  axios.delete(`${CARRITOS_BASE}/${carritoId}`, { headers: authHeaders() });

// ─── CarritoItem ──────────────────────────────────────────────────────────────

// Agrega o incrementa por prendaId + tallaId — resuelve prendaTallaId internamente
export const agregarCarritoItem = (carritoId, prendaId, tallaId) => {
  const params = AgregarCarritoItemParamsSchema.parse({ carritoId, prendaId, tallaId });
  return axios.post(`${API_BASE_BASE}/api/CarritoItems/agregar`, null, { params, headers: authHeaders() });
};

// Usar solo cuando ya se conoce el prendaTallaId — preferir agregarCarritoItem
export const createCarritoItem = async (carritoId, prendaTallaId, cantidad, precioUnitario) => {
  const body = CreateCarritoItemBodySchema.parse({ carritoId, prendaTallaId, cantidad, precioUnitario });
  const r = await axios.post(CARRITO_ITEMS_BASE, body, { headers: authHeaders() });
  return CarritoItemResponseSchema.parse(r.data.data);
};

export const updateItemCantidad = (itemId, cantidad) => {
  const { itemId: id, cantidad: qty } = UpdateItemCantidadSchema.parse({ itemId, cantidad });
  return axios.put(`${CARRITO_ITEMS_BASE}/${id}/cantidad`, null, {
    params: { cantidad: qty },
    headers: authHeaders(),
  });
};

export const deleteCarritoItem = (itemId) =>
  axios.delete(`${CARRITO_ITEMS_BASE}/${itemId}`, { headers: authHeaders() });

// ─── Stock ────────────────────────────────────────────────────────────────────

export const sumarUno = async (prendaId, tallaId) => {
  const params = StockParamsSchema.parse({ prendaId, tallaId });
  const r = await axios.put(`${PRENDA_TALLAS_BASE}/stock/incremento`, null, { params, headers: authHeaders() });
  return r.data.data;
};

export const restarUno = async (prendaId, tallaId) => {
  const params = StockParamsSchema.parse({ prendaId, tallaId });
  const r = await axios.put(`${PRENDA_TALLAS_BASE}/stock/decremento`, null, { params, headers: authHeaders() });
  return r.data.data;
};

export const sumarStock = (prendaId, tallaId, cantidad) => {
  const params = SumarStockParamsSchema.parse({ prendaId, tallaId, cantidad });
  return axios.put(`${PRENDA_TALLAS_BASE}/stock/suma`, null, { params, headers: authHeaders() });
};

// ─── Cupones ──────────────────────────────────────────────────────────────────

export const aplicarCupon = async (codigo) => {
  const { codigo: codigoValido } = AplicarCuponSchema.parse({ codigo });
  const r = await axios.post(
    `${DESCUENTO_CODIGOS_BASE}/codigo/${codigoValido}/aplicar`,
    null,
    { headers: authHeaders() }
  );
  return r.data.data;
};

export const quitarCupon = async (codigo) => {
  const { codigo: codigoValido } = AplicarCuponSchema.parse({ codigo });
  await axios.delete(
    `${DESCUENTO_CODIGOS_BASE}/codigo/${codigoValido}/quitar`,
    { headers: authHeaders() }
  );
};
