import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const AUTH_BASE = `${API_BASE_BASE}/api/auth`;

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

export const changePassword = ({ contraseniaActual, contraseniaNueva }) =>
  axios
    .post(`${AUTH_BASE}/change-password`, { contraseniaActual, contraseniaNueva }, { headers: authHeaders() })
    .then((r) => r.data.data);
