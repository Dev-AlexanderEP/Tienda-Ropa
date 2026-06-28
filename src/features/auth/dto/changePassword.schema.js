import { z } from "zod";

export const ChangePasswordSchema = z.object({
  contraseniaActual: z.string().min(1, "Contraseña actual requerida"),
  contraseniaNueva: z.string().min(8, "Mínimo 8 caracteres"),
});
