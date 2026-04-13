// lib/schemas.ts — Zod validation schemas for all API request bodies
import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
  phone: z.string().max(20).optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const AppointmentSchema = z.object({
  doctorId: z.string().min(1),
  doctorName: z.string().min(1),
  specialty: z.string().min(1),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .refine((d) => new Date(d) > new Date(), 'Date must be in the future'),
  notes: z.string().max(500).optional(),
})

export const DoctorRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  specialtyKey: z.string().min(1, 'Specialty is required'),
})

export const DoctorLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type AppointmentInput = z.infer<typeof AppointmentSchema>
export type DoctorRegisterInput = z.infer<typeof DoctorRegisterSchema>
export type DoctorLoginInput = z.infer<typeof DoctorLoginSchema>
