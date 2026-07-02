import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const BASE = `${API_BASE_BASE}/api/resenias`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getReseniasPublicas = (prendaId) =>
  axios
    .get(`${BASE}/prenda/${prendaId}`, { headers: authHeaders() })
    .then((r) => r.data.data ?? []);

export const createResenia = (prendaId, calificacion, comentario) =>
  axios
    .post(BASE, { prendaId, calificacion, comentario }, { headers: authHeaders() })
    .then((r) => r.data.data);
