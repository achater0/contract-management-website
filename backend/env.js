// env.js
import dotenv from 'dotenv';

dotenv.config();

// Helper function to enforce required environment variables
const getEnvVariable = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ CRITICAL CONFIGURATION ERROR: Missing environment variable [${key}]. Server shutting down.`);
  }
  return value;
};

export const AccessTokenSecret = getEnvVariable('ACCESS_TOKEN_SECRET');
export const adminLogin = getEnvVariable('ADMIN_LOGIN');
export const adminPassword = getEnvVariable('ADMIN_PASSWORD');
export const AccessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY ?? '7d'; 