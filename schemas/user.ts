import { z } from 'zod'

export const UserRole = z.enum(['USER', 'ADMIN'])
export type UserRole = z.infer<typeof UserRole>

export const User = z.object({
	id: z.string().min(1),
	phone: z.string().min(10).max(15),
	role: UserRole.default('USER'),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional()
})
export type User = z.infer<typeof User>

export const UserWithAds = User.extend({
	adsCount: z.number().int().min(0)
})
export type UserWithAds = z.infer<typeof UserWithAds>

export const RegisterRequest = z.object({
	phone: z.string().min(10).max(15)
})
export type RegisterRequest = z.infer<typeof RegisterRequest>

export const LoginRequest = z.object({
	phone: z.string().min(10).max(15)
})
export type LoginRequest = z.infer<typeof LoginRequest>

export const VerifyOTPRequest = z.object({
	phone: z.string().min(10).max(15),
	code: z
		.string()
		.length(6, 'OTP must be 6 digits')
		.regex(/^\d{6}$/, 'OTP must contain only numbers')
})
export type VerifyOTPRequest = z.infer<typeof VerifyOTPRequest>

export const RefreshTokenRequest = z.object({
	refreshToken: z.string().min(1)
})
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequest>

export const RegisterResponse = z.object({
	userId: z.string().min(1)
})
export type RegisterResponse = z.infer<typeof RegisterResponse>

export const LoginResponse = z.object({
	otpSent: z.boolean()
})
export type LoginResponse = z.infer<typeof LoginResponse>

export const VerifyOTPResponse = z.object({
	accessToken: z.string().min(1),
	refreshToken: z.string().min(1),
	user: User
})
export type VerifyOTPResponse = z.infer<typeof VerifyOTPResponse>

export const RefreshTokenResponse = z.object({
	accessToken: z.string().min(1)
})
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponse>

export const AuthState = z.object({
	user: User.nullable(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	isAuthenticated: z.boolean(),
	loading: z.boolean()
})
export type AuthState = z.infer<typeof AuthState>
