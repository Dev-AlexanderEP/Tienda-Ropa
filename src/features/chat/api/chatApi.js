import axios from "axios";
import { API_BASE_BASE } from "../../../config/api";

const CHAT_BASE = `${API_BASE_BASE}/api/Chat`;

export const preguntar = (mensaje) =>
  axios
    .post(`${CHAT_BASE}/preguntar`, { mensaje })
    .then((r) => {
      console.log("[chat] respuesta backend:", r.data.data);
      return r.data.data;
    }); // { texto, productos? }
