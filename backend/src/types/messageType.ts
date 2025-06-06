import { z } from "zod";

const messageType = z.object({
    senderId: z.string(),
    recieverId: z.string(),
    text:z.string()
})