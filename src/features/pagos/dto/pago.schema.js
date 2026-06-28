import { z } from "zod";

export const MetodoPagoResponseSchema = z.object({
  id: z.number(),
  tipoPago: z.string(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export const PagoResponseSchema = z.object({
  id: z.number(),
  ventaId: z.number(),
  metodoId: z.number(),
  monto: z.number(),
  estado: z.enum(["PENDIENTE", "COMPLETADO", "FALLIDO", "REEMBOLSADO"]),
  fechaCreacion: z.string(),
  updatedAt: z.string().nullable().optional(),
});
