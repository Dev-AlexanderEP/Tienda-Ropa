import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import {
  AgregarDetallesBodySchema,
  UpdateVentaBodySchema,
  VentaResponseSchema,
  VentasDetalleResponseSchema,
} from "../dto/venta.schema";

const VENTAS_BASE = `${API_BASE_BASE}/api/ventas`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// ─── Venta ────────────────────────────────────────────────────────────────────

// usuarioId viene del JWT — no se envía body
export const createVenta = () =>
  axios
    .post(VENTAS_BASE, null, { headers: authHeaders() })
    .then((r) => VentaResponseSchema.parse(r.data.data));

export const getVenta = (ventaId) =>
  axios
    .get(`${VENTAS_BASE}/${ventaId}`, { headers: authHeaders() })
    .then((r) => VentaResponseSchema.parse(r.data.data));

// Devuelve el ID (número) de la segunda venta pendiente del usuario autenticado
export const getSegundaPendiente = () =>
  axios
    .get(`${VENTAS_BASE}/segunda-pendiente`, { headers: authHeaders() })
    .then((r) => r.data.data);

// Solo ADMIN
export const deleteVenta = (ventaId) =>
  axios.delete(`${VENTAS_BASE}/${ventaId}`, { headers: authHeaders() });

// Solo ADMIN — body: { estado }
export const updateVenta = (ventaId, estado) => {
  const body = UpdateVentaBodySchema.parse({ estado });
  return axios
    .put(`${VENTAS_BASE}/${ventaId}`, body, { headers: authHeaders() })
    .then((r) => VentaResponseSchema.parse(r.data.data));
};

// ─── Carrito → VentasDetalle ──────────────────────────────────────────────────

// Paso 2 del checkout: copia los CarritoItems como VentasDetalle de la venta
export const agregarDetallesDesdeCarrito = (ventaId, carritoId) => {
  const body = AgregarDetallesBodySchema.parse({ ventaId, carritoId });
  return axios
    .post(`${VENTAS_BASE}/carrito-detalle`, body, { headers: authHeaders() })
    .then((r) => VentasDetalleResponseSchema.array().parse(r.data.data ?? []));
};

// ─── Compuestos ───────────────────────────────────────────────────────────────

// Marca una venta como pagada (solo ADMIN)
export const actualizarVentaPagada = (ventaId) => updateVenta(ventaId, "PAGADO");
