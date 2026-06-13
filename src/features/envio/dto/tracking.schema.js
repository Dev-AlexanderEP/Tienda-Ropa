import { z } from "zod";

export const TrackingSchema = z.object({
  tracking: z.string().min(1, "Ingresa un código de tracking"),
});
