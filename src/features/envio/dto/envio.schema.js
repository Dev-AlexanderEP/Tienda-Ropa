import { z } from "zod";

export const DireccionSchema = z.object({
  departamento: z.string().min(1, "Selecciona un departamento"),
  provincia: z.string().min(1, "Selecciona una provincia"),
  distrito: z.string().min(1, "Selecciona un distrito"),
  calle: z.string().max(100, "Máximo 100 caracteres").optional().default(""),
  detalle: z.string().max(200, "Máximo 200 caracteres").optional().default(""),
  guardarData2: z.boolean().optional().default(false),
});

export const CreateDatosEnvioBodySchema = z.object({
  nombres: z.string().min(1),
  apellidos: z.string().min(1),
  dni: z.string().length(8),
  departamento: z.string().min(1),
  provincia: z.string().min(1),
  distrito: z.string().min(1),
  calle: z.string().max(100).optional().default(""),
  detalle: z.string().max(200).optional().default(""),
  telefono: z.string().min(1),
  email: z.string().email(),
});

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
