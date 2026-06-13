import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

// --- AllPrendasView (by gender) ---

export const getPrendasPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/descuentos-aplicados-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getPrendasFiltradas = (params) =>
  fetch(`${API_BASE}/todas-prendas-filtradas?${params}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getTallasPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/tallas-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getMarcasPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/marcas-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getCategoriasPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/categorias-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => (Array.isArray(d.object) ? d.object : []));

export const getEstadisticasPreciosPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/estadisticas-precios-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => d.object ?? null);

export const getDescuentosPorGenero = (genero) =>
  fetch(`${API_BASE}/prendas/descuentos-por-genero/${genero}`)
    .then((r) => r.json()).then((d) => (Array.isArray(d.object) ? d.object : []));

export const buscarPorNombreGenero = (nombre, genero, signal) => {
  const params = new URLSearchParams({ nombre, genero });
  return fetch(`${API_BASE}/prendas/buscar-por-nombre-genero?${params}`, { signal })
    .then((r) => r.json())
    .then((d) => (Array.isArray(d) ? d : (Array.isArray(d.object) ? d.object : [])));
};

// --- FilterView (by category) ---

export const getPrendasFiltradasPorCategoria = (params) =>
  fetch(`${API_BASE}/prendas-filtradas?${params}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getTallasPorCategoria = (categoria) =>
  fetch(`${API_BASE}/prenda-tallas/${categoria}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getMarcasPorCategoria = (categoria) =>
  fetch(`${API_BASE}/prenda-marcas/${categoria}`)
    .then((r) => r.json()).then((d) => d.object ?? []);

export const getPreciosPorCategoria = (categoria) =>
  fetch(`${API_BASE}/prenda-precios/${categoria}`)
    .then((r) => r.json()).then((d) => d.object ?? null);

export const getDescuentosPorCategoria = (categoria) =>
  fetch(`${API_BASE}/prendas/todos-descuentos/${categoria}`)
    .then((r) => r.json()).then((d) => (Array.isArray(d.object) ? d.object : []));

export const buscarPorNombreCategoria = (nombre, categoria, genero, signal) => {
  const params = new URLSearchParams({ nombre, categoria, genero });
  return fetch(`${API_BASE}/prendas/buscar?${params}`, { signal })
    .then((r) => r.json())
    .then((d) => (Array.isArray(d) ? d : (Array.isArray(d.object) ? d.object : [])));
};

// --- PrendaDetailView ---

export const getPrenda = (id) =>
  fetch(`${API_BASE}/prenda/${id}`).then((r) => r.json()).then((d) => d.object);

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
