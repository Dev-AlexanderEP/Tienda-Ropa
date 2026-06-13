import { z } from "zod";

export const RegisterSchema = z
  .object({
    nombreUsuario: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    contrasenia: z.string().min(6, "Mínimo 6 caracteres"),
    confirmarContrasenia: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.contrasenia === d.confirmarContrasenia, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasenia"],
  });
