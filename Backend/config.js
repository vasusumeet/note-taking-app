import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const mongoDBURL = process.env.MONGODB_URL;
export const jwtSecret = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
