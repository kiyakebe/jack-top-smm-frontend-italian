import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Indirizzo email non valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    ),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Indirizzo email non valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    ),
});

// Schemas per la gestione degli utenti
const createUserSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Indirizzo email non valido"),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    ),
  role: z.enum(["user", "admin"]),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .optional(),
  email: z.string().email("Indirizzo email non valido").optional(),
  password: z
    .string()
    .min(8, "La password deve contenere almeno 8 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale @$!%*?&"
    )
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
