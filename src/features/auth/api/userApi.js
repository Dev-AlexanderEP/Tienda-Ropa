import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

export const getUsuarioId = () =>
  axios.get(`${API_BASE_BASE}/usuario-id`, { headers: authHeaders() }).then((r) => r.data);
