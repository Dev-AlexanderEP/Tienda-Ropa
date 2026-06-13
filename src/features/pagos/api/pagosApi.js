import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getMetodosPago = () =>
  axios.get(`${API_BASE}/metodo-pagos`, { headers: authHeaders() }).then(r => r.data.object || []);

export const getUsuarioId = () =>
  axios.get(`${API_BASE_BASE}/usuario-id`, { headers: authHeaders() }).then(r => r.data);

export const createPago = (ventaId, monto, metodoId) =>
  axios.post(`${API_BASE}/pago`, { ventaId, monto, metodoId, estado: "PAGADO" }, { headers: authHeaders() });

export const getSegundaPendiente = (usuarioId) =>
  axios.get(`${API_BASE}/venta/segunda-pendiente/${usuarioId}`, { headers: authHeaders() }).then(r => r.data.object);

export const updateVenta = (ventaId, usuarioId) =>
  axios.put(`${API_BASE}/venta/${ventaId}`, { id: ventaId, usuarioId, estado: "PAGADO" }, { headers: authHeaders() });

export const updateCarrito = (carritoId, usuarioId) =>
  axios.put(`${API_BASE}/carrito/${carritoId}`, { usuarioId, estado: "COMPLETADO" }, { headers: authHeaders() });

export const createDatoPersonal = (data) =>
  axios.post(`${API_BASE}/dato-personal`, data, { headers: authHeaders() }).then(r => r.data.object.id);

export const createEnvio = (data) =>
  axios.post(`${API_BASE}/envio`, data, { headers: authHeaders() }).then(r => r.data.object.id);

export const createDireccion = (data) =>
  axios.post(`${API_BASE}/direccion`, data, { headers: authHeaders() });

export const enviarCorreo = (envioId) =>
  axios.get(`${API_BASE}/registrar?id=${envioId}`, { headers: authHeaders() });

// --- Composites (shared between FormCreditCart and PaypalButton) ---

export const actualizarVentaPagada = async () => {
  const usuarioId = await getUsuarioId();
  const ventaId = await getSegundaPendiente(usuarioId);
  await updateVenta(ventaId, usuarioId);
};

export const actualizarCarrito = async (carritoId) => {
  const usuarioId = await getUsuarioId();
  await updateCarrito(carritoId, usuarioId);
};

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
