import "dotenv/config";

export const port = process.env.PORT || 3001;
export const db = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'retellai_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Password1!'
};
export const jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const retell = {
    apiKey: process.env.RETELL_API_KEY,
    baseUrl: process.env.RETELL_BASE_URL || 'https://api.retellai.com'
};