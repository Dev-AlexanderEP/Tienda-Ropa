import { z } from "zod";

export const PrendaResponseSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  marcaId: z.number(),
  categoriaId: z.number(),
  proveedorId: z.number(),
  generoId: z.number(),
  precio: z.number(),
  activo: z.boolean(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const PrendaConDescuentoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  precio: z.number(),
  imagenPrincipal: z.string().nullable().optional(),
  imagenHover: z.string().nullable().optional(),
  marca: z.string(),
  descuentoAplicado: z.number(),
  tipoDescuento: z.string(),
});

export const PrendaConDescuentoTodoSchema = PrendaConDescuentoSchema.extend({
  categoria: z.string(),
});

export const PrendaPrecioStatsSchema = z.object({
  minimo: z.number().nullable().optional(),
  promedio: z.number().nullable().optional(),
  maximo: z.number().nullable().optional(),
});
