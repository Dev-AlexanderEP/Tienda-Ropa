import { z } from "zod";

export const FiltrosCatalogoSchema = z.object({
  talla: z.string().optional().default(""),
  marca: z.string().optional().default(""),
  precio: z.string().optional().default(""),
  descuento: z.string().optional().default(""),
  categoria: z.string().optional().default(""),
  busqueda: z.string().optional().default(""),
  genero: z.string().min(1, "Género requerido"),
});
