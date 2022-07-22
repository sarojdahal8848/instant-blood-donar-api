import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/instant-blood-donar";

export const port = process.env.PORT || 5002;

export const API_URL = process.env.API_URL || "http://localhost:5001";

export const JWT_SECRET = <Secret>process.env.JWT_SECRET;
export const EXPIRY_TIME = process.env.EXPIRY_TIME;
