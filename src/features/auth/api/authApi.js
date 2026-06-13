import axios from "axios";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<import("../dto/auth.dto").LoginResponseDTO>}
 */
export const login = (username, password) =>
  axios
    .post(
      `${API_BASE_BASE}/token`,
      new URLSearchParams({ username, password, grantType: "password", withRefreshToken: true }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((res) => res.data);

/**
 * @param {string} credential
 * @param {string} clientId
 * @returns {Promise<import("../dto/auth.dto").LoginResponseDTO>}
 */
export const loginWithGoogle = (credential, clientId) =>
  axios
    .post(`${API_BASE_BASE}/google-login`, { credential, clientId })
    .then((res) => res.data);

/**
 * @param {import("../dto/auth.dto").RegisterRequestDTO} data
 * @returns {Promise<void>}
 */
export const register = async ({ nombreUsuario, email, contrasenia }) => {
  const tokenRes = await axios.post(
    `${API_BASE_BASE}/token`,
    new URLSearchParams({
      username: "admin@example.com",
      password: "123456",
      grantType: "password",
      withRefreshToken: true,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  const { accessToken } = tokenRes.data;

  await axios.post(
    `${API_BASE}/usuarios/create`,
    { nombreUsuario, email, contrasenia },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};
