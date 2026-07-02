import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const AUTH_BASE = `${API_BASE_BASE}/api/auth`;
const NOTIF_BASE = `${API_BASE_BASE}/api/notificaciones`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const login = ({ email, contrasenia }) =>
  axios.post(`${AUTH_BASE}/login`, { email, contrasenia }).then((r) => r.data.data);

export const loginWithGoogle = (idToken) =>
  axios
    .post(`${AUTH_BASE}/google`, JSON.stringify(idToken), {
      headers: { "Content-Type": "application/json" },
    })
    .then((r) => r.data.data);

export const register = ({ nombreUsuario, email, contrasenia }) =>
  axios
    .post(`${AUTH_BASE}/register`, { nombreUsuario, email, contrasenia })
    .then((r) => r.data.data);

export const enviarOtpRecuperacion = ({ email }) =>
  axios
    .post(`${NOTIF_BASE}/recuperar-contrasenia`, { email })
    .then((r) => r.data);

export const verificarOtpRecuperacion = ({ email, codigo, nuevaContrasenia }) =>
  axios
    .post(`${NOTIF_BASE}/verificar-otp`, { email, codigo, nuevaContrasenia })
    .then((r) => r.data);

export const solicitarOtpCambioPassword = () =>
  axios
    .post(`${AUTH_BASE}/solicitar-otp-cambio-password`, {}, { headers: authHeaders() })
    .then((r) => r.data);

export const changePassword = ({ codigo, contraseniaNueva }) =>
  axios
    .post(`${AUTH_BASE}/change-password`, { codigo, contraseniaNueva }, { headers: authHeaders() })
    .then((r) => r.data);
