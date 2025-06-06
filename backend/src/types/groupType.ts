import z from "zod";

export const groupType = z.object({
    groupName: z.string().min(1),
    groupMembers: z.array(z.string()).min(2),
    publicKey: z.array(z.string()).min(2)
})