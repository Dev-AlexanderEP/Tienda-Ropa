import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

export const getEnvioTracking = (codigo) =>
  axios.get(`${API_BASE}/envio/tracking/${codigo.trim()}`, { headers: authHeaders() }).then((r) => r.data);
