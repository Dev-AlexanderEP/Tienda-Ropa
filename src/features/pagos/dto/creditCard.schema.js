import { z } from "zod";

export const CreditCardSchema = z.object({
  name: z
    .string()
    .min(1, "Nombre del titular requerido")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
  card: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Número de tarjeta inválido (XXXX-XXXX-XXXX-XXXX)"),
  month: z.string().min(1, "Selecciona el mes"),
  year: z.string().min(1, "Selecciona el año"),
  ccv: z
    .string()
    .length(3, "El CVV debe tener 3 dígitos")
    .regex(/^\d{3}$/, "Solo dígitos"),
});
