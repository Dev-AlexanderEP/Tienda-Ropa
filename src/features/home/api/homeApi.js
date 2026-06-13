import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

export const getPrendasNovedadesHombre = () =>
  fetch(`${API_BASE}/prendas/descuentos-aplicados-por-genero/hombre`)
    .then((r) => r.json())
    .then((d) => (Array.isArray(d.object) ? d.object : []));

export const getUsuarioId = () =>
  axios.get(`${API_BASE_BASE}/usuario-id`, { headers: authHeaders() }).then((r) => r.data);

export const getCarritoAbierto = (usuarioId) =>
  axios.get(`${API_BASE}/carrito/abierto/usuario/${usuarioId}`, { headers: authHeaders() }).then((r) => r.data);

export const createCarrito = (usuarioId) =>
  axios.post(`${API_BASE}/carrito`, { usuarioId, estado: "ABIERTO" }, { headers: authHeaders() }).then((r) => r.data.object);

export const agregarCarritoItem = (carritoId, prendaId, tallaId) =>
  axios.post(`${API_BASE}/carrito-item/agregar`, null, {
    params: { carritoId, prendaId, tallaId },
    headers: authHeaders(),
  });

export const createCarritoItem = (carritoId, prendaId, talla, cantidad, precioUnitario) =>
  axios.post(`${API_BASE}/carrito-item`, { carritoId, prendaId, talla, cantidad, precioUnitario }, { headers: authHeaders() });

export const restarUno = (prendaId, tallaId) =>
  axios.put(`${API_BASE}/restar-uno?prendaId=${prendaId}&tallaId=${tallaId}`, null, { headers: authHeaders() }).then((r) => r.data);

export const getCantidadItems = (carritoId) =>
  axios.get(`${API_BASE}/carrito/${carritoId}/cantidad-items`, { headers: authHeaders() }).then((r) => r.data.object);
