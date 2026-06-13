import axios from "axios";
import { API_BASE } from "../../../config/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getMetodosPago = () =>
  axios.get(`${API_BASE}/metodo-pagos`, { headers: authHeaders() }).then(r => r.data.object || []);

export const createPago = (ventaId, monto, metodoId) =>
  axios.post(`${API_BASE}/pago`, { ventaId, monto, metodoId, estado: "PAGADO" }, { headers: authHeaders() });
