import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";
import { generatePassword } from "../../utils/password";
import bcrypt from "bcryptjs";
import { generateQRCode } from "../../utils/qrCode";
import { sendCredentialsEmail } from "../../utils/email";
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

export const addStaff = async (req: Request, res: Response) => {
    try{

        console.log("Received request body:", req.body); // Debug: Check incoming data
    console.log("Received file:", (req as any).file);
        const{
            fullName, email, phoneNo, DOB, gender, address,
            warehouseAssigned, status, role,
        } = req.body;

        const profilePic = (req as any).file ? `/upload/${(req as any).file.filename}` : null;
        if (!profilePic) return res.status(400).json({message: "Profile pictuer is required"});

        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const qrCodeData = { email, fullName, phoneNo };
        const qrCodePath = await generateQRCode(qrCodeData);

        const newStaff = new staffMembers({
                fullName,
                email,
                phoneNo,
                DOB: new Date(DOB),
                gender,
                address,
                profilePic,
                dateJoined: new Date(),
                warehouseAssigned,
                status,
                role,
                password: hashedPassword,
                qrCode: qrCodePath,
        });

        await newStaff.save();

        await sendCredentialsEmail(email, fullName, password);

        return res.status(201).json({message: "Staff member added successfully" });
    }catch(error){
        console.error("Error adding staff: ", error);
        return res.status(500).json({message: "Server error", error});
    }
};

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const staff = await staffMembers.find();
        console.log("Staff Data Sent:", staff); 

        if (!staff) {
            return res.status(400).json({ message: "No staff found" });
        }

        return res.status(200).json(staff);
    } catch (error) {
        console.error("Error fetching staff:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


/*export const addStaff = async (req: Request, res: Response) => {
    const staff = req.body;
    await staffMembers.create(staff);
    return res.status(201).send();
}*/

export const getStaffById = async (req: Request, res: Response) => {
    const staff = await staffMembers.findById(req.params.id);
    if(!staff){
        return res.status(404).send();
    }
    return res.status(200).json(staff);
}

export const deleteStaff = async (req: Request, res: Response) => {
    const staff = await staffMembers.findByIdAndDelete(req.params.id);
    if(!staff){
        return res.status(404).send();
    }
    return res.status(204).json(staff);
}

export const updateStaff = async (req: Request, res: Response) => {
    const staff = await staffMembers.findById(req.params.id); // ✅ First, find the staff
    if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
    }

    const updatedStaff = await staffMembers.findByIdAndUpdate(
        req.params.id,
        req.body, // ✅ Correctly updating
        { new: true } // ✅ Returns updated staff
    );

    return res.status(200).json(updatedStaff);
};

