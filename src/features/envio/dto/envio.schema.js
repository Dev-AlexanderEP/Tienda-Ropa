import { z } from "zod";

export const DatosEnvioResponseSchema = z.object({
  id: z.number(),
  usuarioId: z.number(),
  nombres: z.string(),
  apellidos: z.string(),
  dni: z.string(),
  departamento: z.string(),
  provincia: z.string(),
  distrito: z.string(),
  calle: z.string().nullable().optional(),
  detalle: z.string(),
  telefono: z.string(),
  email: z.string(),
  esPrincipal: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export const EnvioResponseSchema = z.object({
  id: z.number(),
  ventaId: z.number(),
  datosEnvioId: z.number(),
  costoEnvio: z.number(),
  fechaEnvio: z.string(),
  fechaEntrega: z.string().nullable().optional(),
  estado: z.enum(["PREPARANDO", "EN_CAMINO", "ENTREGADO", "DEVUELTO"]),
  metodoEnvio: z.string(),
  trackingNumber: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});
