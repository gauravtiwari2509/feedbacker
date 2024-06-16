import {z} from 'zod'
export const usernameValidation=z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9._]{3,20}$/, 'Username must only contain letters, numbers, underscores, or periods');

    export const signUpSchema=z.object({
        username: usernameValidation,
        email: z.string().email({message:"invalid email address"}),
        password: z.string().min(8, "Password must be at least 8 characters long"),
    })