import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import {
  AgregarCarritoItemParamsSchema,
  AplicarCuponSchema,
  CarritoItemDetalleResponseSchema,
  CarritoItemResponseSchema,
  CarritoResponseSchema,
  CreateCarritoItemBodySchema,
  EstadoCarritoSchema,
  StockParamsSchema,
  SumarStockParamsSchema,
  UpdateItemCantidadSchema,
} from "../dto/carrito.schema";

const CARRITOS_BASE = `${API_BASE_BASE}/api/carritos`;
const CARRITO_ITEMS_BASE = `${API_BASE_BASE}/api/carrito-items`;
const PRENDA_TALLAS_BASE = `${API_BASE_BASE}/api/prenda-tallas`;
const DESCUENTO_BASE = `${API_BASE_BASE}/api`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// ─── Carrito ─────────────────────────────────────────────────────────────────

export const getCarritoAbierto = (usuarioId) =>
  axios
    .get(`${CARRITOS_BASE}/abierto/usuario/${usuarioId}`, { headers: authHeaders() })
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

// body es el string del estado directamente, no un objeto
export const updateCarrito = (carritoId, estado = "COMPLETADO") => {
  const estadoValido = EstadoCarritoSchema.parse(estado);
  return axios.put(`${CARRITOS_BASE}/${carritoId}`, JSON.stringify(estadoValido), {
    headers: { ...authHeaders(), "Content-Type": "application/json" },
  });
};

export const deleteCarrito = (carritoId) =>
  axios.delete(`${CARRITOS_BASE}/${carritoId}`, { headers: authHeaders() });

export const actualizarCarrito = (carritoId) => updateCarrito(carritoId, "COMPLETADO");

// ─── CarritoItem ──────────────────────────────────────────────────────────────

// Agrega o incrementa por prendaId + tallaId — resuelve prendaTallaId internamente
export const agregarCarritoItem = (carritoId, prendaId, tallaId) => {
  const params = AgregarCarritoItemParamsSchema.parse({ carritoId, prendaId, tallaId });
  return axios.post(`${CARRITO_ITEMS_BASE}/agregar`, null, { params, headers: authHeaders() });
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

// ─── Stock (solo ADMIN) ───────────────────────────────────────────────────────

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
  const descuento = await axios
    .get(`${DESCUENTO_BASE}/descuento-codigos/codigo/${codigoValido}`, { headers: authHeaders() })
    .then((r) => r.data.data);
  await axios.post(
    `${DESCUENTO_BASE}/descuento-usuarios`,
    { descuentoCodigoId: descuento.id },
    { headers: authHeaders() }
  );
  return descuento;
};
