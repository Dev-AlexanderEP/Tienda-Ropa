import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const BASE = `${API_BASE_BASE}/api/resenias`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

const getCurrentUserId = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    return payload.sub ?? payload.nameid ?? null;
  } catch {
    return null;
  }
};

export const getReseniasPublicas = (prendaId) =>
  axios
    .get(`${BASE}/prenda/${prendaId}`, { headers: authHeaders() })
    .then((r) => r.data.data ?? []);

export const getMiResenia = (prendaId) => {
  const userId = getCurrentUserId();
  if (!userId) return Promise.resolve(null);
  return axios
    .get(BASE, {
      params: { prendaId, usuarioId: userId, pageSize: 1, page: 1 },
      headers: authHeaders(),
    })
    .then((r) => {
      const d = r.data;
      const items = Array.isArray(d?.data)
        ? d.data
        : Array.isArray(d?.data?.items)
        ? d.data.items
        : [];
      return items[0] ?? null;
    })
    .catch(() => null);
};

export const createResenia = (prendaId, calificacion, comentario) =>
  axios
    .post(BASE, { prendaId, calificacion, comentario }, { headers: authHeaders() })
    .then((r) => r.data.data);

export const updateResenia = (id, calificacion, comentario) =>
  axios
    .put(`${BASE}/${id}`, { calificacion, comentario }, { headers: authHeaders() })
    .then((r) => r.data.data);
