import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getUsuarioId = () =>
  axios.get(`${API_BASE_BASE}/usuario-id`, { headers: authHeaders() }).then(r => r.data);

export const getCarrito = (carritoId) =>
  axios.get(`${API_BASE}/carrito/${carritoId}`, { headers: authHeaders() }).then(r => r.data.object);

export const updateItemCantidad = (itemId, cantidad) =>
  axios.put(`${API_BASE}/carrito-item/${itemId}/cantidad?cantidad=${cantidad}`, null, { headers: authHeaders() });

export const sumarUno = (prendaId, tallaId) =>
  axios.put(`${API_BASE}/sumar-uno?prendaId=${prendaId}&tallaId=${tallaId}`, null, { headers: authHeaders() }).then(r => r.data);

export const restarUno = (prendaId, tallaId) =>
  axios.put(`${API_BASE}/restar-uno?prendaId=${prendaId}&tallaId=${tallaId}`, null, { headers: authHeaders() }).then(r => r.data);

export const sumarStock = (prendaId, tallaId, cantidad) =>
  axios.put(`${API_BASE}/sumar?prendaId=${prendaId}&tallaId=${tallaId}&cantidad=${cantidad}`, null, { headers: authHeaders() });

export const deleteCarritoItem = (itemId) =>
  axios.delete(`${API_BASE}/carrito-item/${itemId}`, { headers: authHeaders() });

export const aplicarCupon = (usuarioId, codigo) =>
  axios.post(`${API_BASE}/aplicar`, { usuarioId: Number(usuarioId), codigo }, { headers: authHeaders() }).then(r => r.data);

export const createVenta = (usuarioId) =>
  axios.post(`${API_BASE}/venta`, { usuarioId, estado: "PENDIENTE" }, { headers: authHeaders() }).then(r => r.data.object);

export const getSegundaPendiente = (usuarioId) =>
  axios.get(`${API_BASE}/venta/segunda-pendiente/${usuarioId}`, { headers: authHeaders() }).then(r => r.data.object);

export const deleteVenta = (ventaId) =>
  axios.delete(`${API_BASE}/venta/${ventaId}`, { headers: authHeaders() });

export const createCarritoDetalle = (ventaId, carritoId) =>
  axios.post(`${API_BASE}/carritodetalle`, { ventaId, carritoId }, { headers: authHeaders() });
