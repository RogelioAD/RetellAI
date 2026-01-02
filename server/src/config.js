import "dotenv/config";

export const port = process.env.PORT || 3001;
export const db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
};
export const jwtSecret = process.env.JWT_SECRET;
export const retell = {
    apiKey: process.env.RETELL_API_KEY,
    baseUrl: process.env.RETELL_BASE_URL
};