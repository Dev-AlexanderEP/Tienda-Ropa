import axios from "axios";
import { getUsuarioId } from "../auth/api/userApi";
import { API_BASE } from "../../../config/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

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

export const getCantidadItems = (carritoId) =>
  axios.get(`${API_BASE}/carrito/${carritoId}/cantidad-items`, { headers: authHeaders() }).then((r) => r.data.object);

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

export const createCarritoDetalle = (ventaId, carritoId) =>
  axios.post(`${API_BASE}/carritodetalle`, { ventaId, carritoId }, { headers: authHeaders() });

export const updateCarrito = (carritoId, usuarioId) =>
  axios.put(`${API_BASE}/carrito/${carritoId}`, { usuarioId, estado: "COMPLETADO" }, { headers: authHeaders() });

export const actualizarCarrito = async (carritoId) => {
  const usuarioId = await getUsuarioId();
  await updateCarrito(carritoId, usuarioId);
};
