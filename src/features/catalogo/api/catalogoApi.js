import axios from "axios";
import { z } from "zod";
import { API_BASE_BASE } from "../../../config/api";
import {
  PrendaConDescuentoSchema,
  PrendaConDescuentoTodoSchema,
  PrendaPrecioStatsSchema,
  PrendaResponseSchema,
  PrendaDetalladaResponseSchema,
} from "../dto/prendas.schema";

const PRENDAS_BASE = `${API_BASE_BASE}/api/prendas`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// --- AllPrendasView (by gender) ---

export const getPrendasPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/con-descuentos-aleatorio/${genero}`, { headers: authHeaders() })
    .then((r) => PrendaConDescuentoTodoSchema.array().parse(r.data.data ?? []));

export const getPrendasFiltradas = (params) =>
  axios
    .get(`${PRENDAS_BASE}/filtro?${params}`, { headers: authHeaders() })
    .then((r) => PrendaConDescuentoSchema.array().parse(r.data.data ?? []));

export const getTallasPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/tallas-por-genero/${genero}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const getMarcasPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/marcas-por-genero/${genero}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const getCategoriasPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/categorias-por-genero/${genero}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const getEstadisticasPreciosPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/precios-por-genero/${genero}`, { headers: authHeaders() })
    .then((r) => PrendaPrecioStatsSchema.nullable().parse(r.data.data ?? null));

export const getDescuentosPorGenero = (genero) =>
  axios
    .get(`${PRENDAS_BASE}/descuentos-por-genero/${genero}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const buscarPorNombreGenero = (nombre, genero, signal) => {
  const params = new URLSearchParams({ nombre, genero });
  return axios
    .get(`${PRENDAS_BASE}/busqueda-por-nombre-genero?${params}`, { headers: authHeaders(), signal })
    .then((r) => PrendaConDescuentoSchema.array().parse(r.data.data ?? []));
};

// --- FilterView (by category) ---

export const getPrendasFiltradasPorCategoria = (params) =>
  axios
    .get(`${PRENDAS_BASE}/filtro?${params}`, { headers: authHeaders() })
    .then((r) => PrendaConDescuentoSchema.array().parse(r.data.data ?? []));

export const getTallasPorCategoria = (categoria) =>
  axios
    .get(`${PRENDAS_BASE}/tallas-por-categoria/${categoria}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const getMarcasPorCategoria = (categoria) =>
  axios
    .get(`${PRENDAS_BASE}/marcas-por-categoria/${categoria}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const getPreciosPorCategoria = (categoria) =>
  axios
    .get(`${PRENDAS_BASE}/precios-por-categoria/${categoria}`, { headers: authHeaders() })
    .then((r) => PrendaPrecioStatsSchema.nullable().parse(r.data.data ?? null));

export const getDescuentosPorCategoria = (categoria) =>
  axios
    .get(`${PRENDAS_BASE}/descuentos-por-categoria/${categoria}`, { headers: authHeaders() })
    .then((r) => z.string().array().parse(r.data.data ?? []));

export const buscarPorNombreCategoria = (nombre, categoria, genero, signal) => {
  const params = new URLSearchParams({ nombre, categoria, genero });
  return axios
    .get(`${PRENDAS_BASE}/busqueda?${params}`, { headers: authHeaders(), signal })
    .then((r) => PrendaConDescuentoSchema.array().parse(r.data.data ?? []));
};

// --- PrendaDetailView ---

export const getPrenda = (id) =>
  axios
    .get(`${PRENDAS_BASE}/${id}/detalle`, { headers: authHeaders() })
    .then((r) => PrendaDetalladaResponseSchema.parse(r.data.data));
