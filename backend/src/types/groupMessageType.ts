import z from "zod";

export const groupMessageType = z.object({
    groupId: z.string().min(1),
    encryptedText: z.string().min(1),
    senderId: z.string().min(1)
});