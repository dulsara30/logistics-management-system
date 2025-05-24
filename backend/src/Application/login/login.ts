import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //validate actually the body has email and password or not
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        //since email is unique this will find user by email
        const user = await staffMembers.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //     //password comparison
        //    const isMatch = await bcrypt.compare(password, user.password);
        //     if(!isMatch){
        //         return res.status(401).json({message: "Invalid email or password"});
        //     }

        //Generate jwt token

        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            fullName: user.fullName
        });

        return res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

/*import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate that the body has email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Hardcoded login credentials for temporary access
        const hardcodedEmail = "dulsaramanakal@gmail.com";
        const hardcodedPassword = "123456";
        const hardcodedUser = {
            _id: "hardcoded-user-id-123", // Temporary ID
            email: hardcodedEmail,
            role: "Warehouse Manager",
            fullName: "Dulsara Manakal"
        };

        // Check if the provided credentials match the hardcoded ones
        if (email === hardcodedEmail && password === hardcodedPassword) {
            // Generate token for the hardcoded user
            const token = generateToken({
                id: hardcodedUser._id,
                email: hardcodedUser.email,
                role: hardcodedUser.role,
                fullName: hardcodedUser.fullName
            });

            return res.status(200).json({ token, role: hardcodedUser.role });
        }

        // If hardcoded credentials don't match, proceed with normal login
        const user = await staffMembers.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            fullName: user.fullName
        });

        return res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};*/