import { z } from "zod";
import { DireccionSchema } from "./envio.schema";

export const DatosPersonalesSchema = z.object({
  correo: z.string().email("Email inválido").max(50, "Máximo 50 caracteres"),
  nombre: z
    .string()
    .min(1, "Nombre requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
  apellidos: z
    .string()
    .min(1, "Apellidos requeridos")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
  documento: z
    .string()
    .length(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d{8}$/, "Solo dígitos"),
  telefono: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length === 9, "El teléfono debe tener 9 dígitos"),
  acepta: z.literal(true, { errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }) }),
  guardarData1: z.boolean().optional().default(false),
  deseaFactura: z.boolean().optional().default(false),
  novedades: z.boolean().optional().default(false),
}).merge(DireccionSchema.partial());
