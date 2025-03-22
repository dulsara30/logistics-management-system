import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "+E^z%S$q6E:C<H";
const JWT_EXPIRES_IN = "30min";

export const generateToken = (user: { id: String; email: string; role: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN}
    );
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}