import { z } from "zod";

export const DireccionSchema = z.object({
  departamento: z.string().min(1, "Selecciona un departamento"),
  provincia: z.string().min(1, "Selecciona una provincia"),
  distrito: z.string().min(1, "Selecciona un distrito"),
  calle: z.string().max(100, "Máximo 100 caracteres").optional().default(""),
  detalle: z.string().max(200, "Máximo 200 caracteres").optional().default(""),
  guardarData2: z.boolean().optional().default(false),
});
