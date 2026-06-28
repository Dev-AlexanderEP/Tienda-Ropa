import { z } from "zod";

// ─── Schemas de respuesta ─────────────────────────────────────────────────────

export const CarritoResponseSchema = z.object({
  id: z.number(),
  usuarioId: z.number(),
  fechaCreacion: z.string().nullable().optional(),
  estado: z.enum(["ACTIVO", "ABANDONADO", "COMPLETADO"]).nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const CarritoItemResponseSchema = z.object({
  id: z.number(),
  carritoId: z.number(),
  prendaTallaId: z.number(),
  precioUnitario: z.number(),
  cantidad: z.number(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const CarritoItemDetalleResponseSchema = CarritoItemResponseSchema.extend({
  prendaId: z.number(),
  tallaId: z.number(),
  prenda: z.object({
    nombre: z.string(),
    precio: z.number(),
    imagenPrincipal: z.string().nullable().optional(),
    nomMarca: z.string(),
  }),
  talla: z.object({
    nomTalla: z.string(),
  }),
});

// ─── Schemas de request / params ──────────────────────────────────────────────

const id = z.number().int().positive();

export const EstadoCarritoSchema = z.enum(["ACTIVO", "ABANDONADO", "COMPLETADO"]);

export const AgregarCarritoItemParamsSchema = z.object({
  carritoId: id,
  prendaId: id,
  tallaId: id,
});

export const CreateCarritoItemBodySchema = z.object({
  carritoId: id,
  prendaTallaId: id,
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
});

export const UpdateItemCantidadSchema = z.object({
  itemId: id,
  cantidad: z.number().int().positive(),
});

export const StockParamsSchema = z.object({
  prendaId: id,
  tallaId: id,
});

export const SumarStockParamsSchema = StockParamsSchema.extend({
  cantidad: z.number().int().positive(),
});

export const AplicarCuponSchema = z.object({
  codigo: z.string().min(1, "Código requerido"),
});
