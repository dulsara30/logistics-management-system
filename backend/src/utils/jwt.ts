import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "sJY9dS68PU";
const JWT_EXPIRES_IN = "30min";

export const generateToken = (user: { id: string; email: string; role: string; fullName: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}