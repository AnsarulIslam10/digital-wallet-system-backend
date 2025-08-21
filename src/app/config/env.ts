import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string
    NODE_ENV: "development" | "production",
    BCRYPT_SALT_ROUND: string
    JWT_ACCESS_SECRET: string
    JWT_ACCESS_EXPIRES: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRES: string
    TRANSACTION_FEE_PERCENT: number;
    DAILY_SEND_LIMIT: number;
    FRONTEND_URL: string;
}

const lodaEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", 'TRANSACTION_FEE_PERCENT',
        'DAILY_SEND_LIMIT', "FRONTEND_URL",];

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        TRANSACTION_FEE_PERCENT: Number(process.env.TRANSACTION_FEE_PERCENT),
        DAILY_SEND_LIMIT: Number(process.env.DAILY_SEND_LIMIT),
        FRONTEND_URL: process.env.FRONTEND_URL as string,

    }
}

export const envVars = lodaEnvVariables()