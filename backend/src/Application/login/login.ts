import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";

export const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        //validate actually the body has email and password or not
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        //since email is unique this will find user by email
        const user = await staffMembers.findOne({ email });
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        //password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        //Generate jwt token

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return res.status(200).json({token, role: user.role});
    }catch (error){
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Server error", error});
    }
};