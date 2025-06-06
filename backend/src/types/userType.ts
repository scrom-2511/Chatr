import { z } from "zod";

const signupType = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  profilePic: z.string().default("img_link")
});

const signinType = z.object({
    email:z.string(),
    password:z.string()
})

export { signupType, signinType };
