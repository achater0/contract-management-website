import dotenv from 'dotenv'

dotenv.config()

export const AccessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? 'error'
export const adminLogin = process.env.ADMIN_LOGIN ?? 'error'
export const adminPassword = process.env.ADMIN_PASSWORD ?? 'error'
export const AccessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY ?? 'error'
