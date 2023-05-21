import { z } from "zod";

export const botInput = z.object({
    name: z.coerce.string(),
    channel: z.coerce.string(),
    imageUrl: z.coerce.string(),
    type: z.coerce.string(),
});

export const botMessageInput = z.object({
    message: z.coerce.string(),
    user: z.coerce.string()
});

export const webhookSchema = z.object({
    name: z.coerce.string(),
    webhookUrl: z.coerce.string(),
    ownerId: z.coerce.string()
});
