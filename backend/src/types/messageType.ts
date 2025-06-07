import { z } from "zod";

export const messageType = z.object({
    senderId: z.string(),
    recieverId: z.string(),
    text:z.string(),
    isImage:z.boolean().default(false)
})