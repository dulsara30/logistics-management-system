import { Request, Response } from "express";
import  staffMembers  from "../../Infrastructure/schemas/staff"
import { uploadQRCodeToCloudinary, uploadToCloudinary } from "../../utils/cloudinary";
import bcrypt from "bcryptjs";

   // Get staff by ID
   export const getProfileById = async (id: string, res: Response) => {
     try {
       const staff = await staffMembers.findById(id);
       if (!staff) {
         return res.status(404).json({ message: "Staff not found" });
       }
       return res.status(200).json(staff);
     } catch (error) {
       return res.status(500).json({ message: "Server error", error: (error as Error).message });
     }
   };

   // Get all staff
   export const getAllProfile = async (req: Request, res: Response) => {
     try {
       const staff = await staffMembers.find();
       return res.status(200).json(staff);
     } catch (error) {
       return res.status(500).json({ message: "Server error", error: (error as Error).message });
     }
   };


   // Update staff (modified to accept id as a parameter)
   export const updateProfile = async (id: string, req: Request, res: Response) => {
     try {
       const staffData = req.body;
  
       if(req.file){
        const fileName =  `profile_${id}_${Date.now()}`;
        const folder = "staff_profiles";
        const secureUrl = await uploadToCloudinary(req.file, fileName, folder);
        staffData.profilePic = secureUrl;
       }

       // Handle password update if newPassword is provided
      if (staffData.newPassword) {
        staffData.password = await bcrypt.hash(staffData.newPassword, 10);
        delete staffData.newPassword; // Remove newPassword from the data
      }

      const updatedStaff = await staffMembers.findByIdAndUpdate(id, staffData, { new: true });
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      return res.status(200).json(updatedStaff);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
   };

