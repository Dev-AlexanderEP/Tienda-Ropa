import axios from "axios";
import { getUsuarioId } from "../../auth/api/userApi";
import { API_BASE } from "../../../config/api";

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

export const getEnvioTracking = (codigo) =>
  axios.get(`${API_BASE}/envio/tracking/${codigo.trim()}`, { headers: authHeaders() }).then((r) => r.data);

export const getDireccionesUsuario = (usuarioId) =>
  axios.get(`${API_BASE}/direcciones/usuario/${usuarioId}`, { headers: authHeaders() }).then((r) => r.data.object ?? []);

export const createDatoPersonal = (data) =>
  axios.post(`${API_BASE}/dato-personal`, data, { headers: authHeaders() }).then(r => r.data.object.id);

export const createEnvio = (data) =>
  axios.post(`${API_BASE}/envio`, data, { headers: authHeaders() }).then(r => r.data.object.id);

export const createDireccion = (data) =>
  axios.post(`${API_BASE}/direccion`, data, { headers: authHeaders() });

export const enviarCorreo = (envioId) =>
  axios.get(`${API_BASE}/registrar?id=${envioId}`, { headers: authHeaders() });

export const registrarDatosPersonalesYEnvio = async (datos, ventaId) => {
  const usuarioId = await getUsuarioId();

  const datosPersonalesId = await createDatoPersonal({
    nombres: datos.nombre,
    apellidos: datos.apellidos,
    usuarioId,
    dni: datos.documento,
    departamento: datos.departamento,
    provincia: datos.provincia,
    distrito: datos.distrito,
    calle: datos.calle,
    detalle: datos.detalle,
    telefono: datos.telefono,
    email: datos.correo,
  });

  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const finMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  const randomTracking = Array.from({ length: 10 }, () =>
    Math.random() < 0.5
      ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
      : Math.floor(Math.random() * 9) + 1
  ).join("");

  return await createEnvio({
    ventaId,
    datosPersonalesId,
    costoEnvio: 0,
    fechaEnvio: inicioMes,
    fechaEntrega: finMes,
    estado: "EN PROCESO",
    metodoEnvio: "Delivery",
    trackingNumber: randomTracking,
  });
};

export const guardarDireccion = async (datos) => {
  const usuarioId = await getUsuarioId();
  await createDireccion({
    nombres: datos.nombre,
    apellidos: datos.apellidos,
    usuarioId,
    dni: datos.documento,
    departamento: datos.departamento,
    provincia: datos.provincia,
    calle: datos.calle,
    distrito: datos.distrito,
    detalle: datos.detalle,
    telefono: datos.telefono,
  });
};
