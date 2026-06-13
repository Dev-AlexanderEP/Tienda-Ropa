import { API_BASE } from "../../../config/api";

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

