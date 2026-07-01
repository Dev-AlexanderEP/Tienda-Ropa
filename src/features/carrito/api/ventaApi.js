import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import {
  AgregarDetallesBodySchema,
  VentaResponseSchema,
  VentasDetalleResponseSchema,
} from "../dto/venta.schema";

const VENTAS_BASE = `${API_BASE_BASE}/api/Ventas`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// ─── Venta ────────────────────────────────────────────────────────────────────

// usuarioId viene del JWT — no se envía body
export const createVenta = () =>
  axios
    .post(VENTAS_BASE, {}, { headers: { ...authHeaders(), "Content-Type": "application/json" } })
    .then((r) => VentaResponseSchema.parse(r.data.data));

export const getVenta = (ventaId) =>
  axios
    .get(`${VENTAS_BASE}/${ventaId}`, { headers: authHeaders() })
    .then((r) => VentaResponseSchema.parse(r.data.data));

// Devuelve el ID (número) de la segunda venta pendiente del usuario autenticado,
// o null si no existe (backend responde 404 en ese caso — no es un error real)
export const getSegundaPendiente = () =>
  axios
    .get(`${VENTAS_BASE}/segunda-pendiente`, { headers: authHeaders() })
    .then((r) => r.data.data)
    .catch((error) => {
      if (error.response?.status === 404) return null;
      throw error;
    });

export const deleteVenta = (ventaId) =>
  axios.delete(`${VENTAS_BASE}/${ventaId}`, { headers: authHeaders() });

// ─── Carrito → VentasDetalle ──────────────────────────────────────────────────

// Paso 2 del checkout: copia los CarritoItems como VentasDetalle de la venta
export const agregarDetallesDesdeCarrito = (ventaId, carritoId) => {
  const body = AgregarDetallesBodySchema.parse({ ventaId, carritoId });
  return axios
    .post(`${VENTAS_BASE}/carrito-detalle`, body, { headers: authHeaders() })
    .then((r) => VentasDetalleResponseSchema.array().parse(r.data.data ?? []));
};
