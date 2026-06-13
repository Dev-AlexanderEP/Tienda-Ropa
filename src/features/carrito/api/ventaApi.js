import axios from "axios";
import { getUsuarioId } from "../../auth/api/userApi";
import { API_BASE } from "../../../config/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const createVenta = (usuarioId) =>
  axios.post(`${API_BASE}/venta`, { usuarioId, estado: "PENDIENTE" }, { headers: authHeaders() }).then(r => r.data.object);

export const getSegundaPendiente = (usuarioId) =>
  axios.get(`${API_BASE}/venta/segunda-pendiente/${usuarioId}`, { headers: authHeaders() }).then(r => r.data.object);

export const deleteVenta = (ventaId) =>
  axios.delete(`${API_BASE}/venta/${ventaId}`, { headers: authHeaders() });

export const updateVenta = (ventaId, usuarioId) =>
  axios.put(`${API_BASE}/venta/${ventaId}`, { id: ventaId, usuarioId, estado: "PAGADO" }, { headers: authHeaders() });

export const actualizarVentaPagada = async () => {
  const usuarioId = await getUsuarioId();
  const ventaId = await getSegundaPendiente(usuarioId);
  await updateVenta(ventaId, usuarioId);
};
