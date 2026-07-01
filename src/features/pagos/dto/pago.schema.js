import { z } from "zod";

export const TipoPago = /** @type {const} */ ({
  TARJETA_CREDITO: "TARJETA_CREDITO",
  YAPE: "YAPE",
  PAYPAL: "PAYPAL",
  MERCADO_PAGO: "MERCADO_PAGO",
});

export const TipoPagoSchema = z.enum(["TARJETA_CREDITO", "YAPE", "PAYPAL", "MERCADO_PAGO"]);

export const MetodoPagoResponseSchema = z.object({
  id: z.number(),
  tipoPago: TipoPagoSchema,
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

export const CreatePagoMercadoPagoBodySchema = z.object({
  ventaId: z.number(),
  metodoId: z.number(),
  token: z.string().min(1),
  paymentMethodId: z.string().min(1),
  issuerId: z.string().nullable().optional(),
  installments: z.number().min(1),
  payerEmail: z.string().email(),
  identificacionTipo: z.string().nullable().optional(),
  identificacionNumero: z.string().nullable().optional(),
});

export const CreatePagoPayPalBodySchema = z.object({
  ventaId: z.number(),
  metodoId: z.number(),
});

export const PagoPayPalIniciadoSchema = z.object({
  pagoId: z.number(),
  orderId: z.string(),
});

export const CapturarPagoPayPalBodySchema = z.object({
  pagoId: z.number(),
  orderId: z.string().min(1),
});
