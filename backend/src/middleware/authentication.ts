import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { Message } from "twilio/lib/twiml/MessagingResponse";

//this middleware ging to check
export const authenticateToken = (req: Request, res: Response, next: NextFunction ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; //who beare the token

    if(!token){
        return res.status(401).json({ message: "Access token required" });
    }

    try{
        const decoded = verifyToken(token);
        (req as any).user = decoded; //attach user infor to request
        next();
    }catch (error){
        return res.status(403).json({ message: "Invalid or expired token"});
    }
};

//this gonna check the user role
export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if(!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions"});
        }

        next();
    };




    const jwt = require("jsonwebtoken");

const authMiddleware = (req: { headers: { authorization: any; }; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or invalid token format" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded; // Attach user info to the request (e.g., user ID)
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
};