import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";
import { CreateDatosEnvioBodySchema, DatosEnvioResponseSchema, EnvioResponseSchema, EnvioTrackingResponseSchema } from "../dto/envio.schema";

const DATOS_ENVIO_BASE = `${API_BASE_BASE}/api/DatosEnvio`;
const ENVIO_BASE = `${API_BASE_BASE}/api/envio`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// --- DatosEnvio ---

export const getMisDirecciones = () =>
  axios
    .get(`${DATOS_ENVIO_BASE}/mis-direcciones`, { headers: authHeaders() })
    .then((r) => DatosEnvioResponseSchema.array().parse(r.data.data ?? []));

export const createDatosEnvio = async (data) => {
  const body = CreateDatosEnvioBodySchema.parse(data);
  const r = await axios.post(DATOS_ENVIO_BASE, body, { headers: authHeaders() });
  return DatosEnvioResponseSchema.parse(r.data.data);
};

export const updateDatosEnvio = (id, data) => {
  const body = CreateDatosEnvioBodySchema.parse(data);
  return axios
    .put(`${DATOS_ENVIO_BASE}/${id}`, body, { headers: authHeaders() })
    .then((r) => DatosEnvioResponseSchema.parse(r.data.data));
};

export const deleteDatosEnvio = (id) =>
  axios.delete(`${DATOS_ENVIO_BASE}/${id}`, { headers: authHeaders() });

// El backend permite un solo registro de DatosEnvio por usuario (409 si ya existe) —
// hay que consultarlo primero y elegir POST o PUT según corresponda
const guardarOActualizarDatosEnvio = async (data) => {
  const direcciones = await getMisDirecciones();
  return direcciones.length === 0
    ? createDatosEnvio(data)
    : updateDatosEnvio(direcciones[0].id, data);
};

// --- Envio ---

export const getEnvioTracking = (trackingNumber) =>
  axios
    .get(`${ENVIO_BASE}/tracking/${trackingNumber.trim()}`, { headers: authHeaders() })
    .then((r) => EnvioTrackingResponseSchema.parse(r.data.data));

export const createEnvio = (data) =>
  axios
    .post(ENVIO_BASE, data, { headers: authHeaders() })
    .then((r) => EnvioResponseSchema.parse(r.data.data));

// --- Funciones compuestas (usadas en checkout) ---

export const registrarDatosPersonalesYEnvio = async (datos, ventaId) => {
  const { id: datosEnvioId } = await guardarOActualizarDatosEnvio({
    nombres: datos.nombre,
    apellidos: datos.apellidos,
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
  const fechaEnvio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const fechaEntrega = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  const trackingNumber = Array.from({ length: 10 }, () =>
    Math.random() < 0.5
      ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
      : Math.floor(Math.random() * 9) + 1
  ).join("");

  const envio = await createEnvio({
    ventaId,
    datosEnvioId,
    costoEnvio: 0,
    fechaEnvio,
    fechaEntrega,
    estado: "PREPARANDO",
    metodoEnvio: "Delivery",
    trackingNumber,
  });

  return envio.id;
};

export const guardarDireccion = (datos) =>
  guardarOActualizarDatosEnvio({
    nombres: datos.nombre,
    apellidos: datos.apellidos,
    dni: datos.documento,
    departamento: datos.departamento,
    provincia: datos.provincia,
    distrito: datos.distrito,
    calle: datos.calle,
    detalle: datos.detalle,
    telefono: datos.telefono,
    email: datos.email,
  });
