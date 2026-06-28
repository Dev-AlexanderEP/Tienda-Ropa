import { z } from "zod";

// ─── Schemas de respuesta ─────────────────────────────────────────────────────

export const EstadoVentaSchema = z.enum([
  "PENDIENTE",
  "PAGADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
]);

export const VentaResponseSchema = z.object({
  id: z.number(),
  usuarioId: z.number(),
  fechaCreacion: z.string(),
  estado: EstadoVentaSchema.nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const VentasDetalleResponseSchema = z.object({
  id: z.number(),
  ventaId: z.number(),
  prendaTallaId: z.number(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

// ─── Schemas de request / body ────────────────────────────────────────────────

const id = z.number().int().positive();

export const UpdateVentaBodySchema = z.object({
  estado: EstadoVentaSchema,
});

export const AgregarDetallesBodySchema = z.object({
  ventaId: id,
  carritoId: id,
});
