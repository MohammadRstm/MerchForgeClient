import z from "zod";

export const signupSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(2 , "Firstname must be atleast 2 charachters long"),
    
    lastname: z
        .string()
        .trim()
        .min(2, "Lastname must be atleast 2 charachters long"),

    username: z
        .string()
        .trim()
        .min(5, "Username must be atleast 5 characters long"),
    
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long"),
});

export const signupResponseScehma = z.object({
    token: z.string(),

    user: z.object({
        id: z.number(),
        firstname: z.string(),
        lastname: z.string(),
        username: z.string(),
    }),
});