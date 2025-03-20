import { Request, Response } from "express";
import staffMembers from "../../Infrastructure/schemas/staff";

export const getAllStaff = async (req: Request, res: Response) => {
    const staff = await staffMembers.find();
    if(!staff)
    {
        return res.status(400).send();
    }
    return res.status(200).json(staff);
}

export const addStaff = async (req: Request, res: Response) => {
    const staff = req.body;
    await staffMembers.create(staff);
    return res.status(201).send();
}

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
    const staff = await staffMembers.findByIdAndDelete(req.params.id);
    if(!staff){
        return res.status(404).json({message: "job not found"});
    }

    const updatedStaff = await staffMembers.findByIdAndUpdate(
        req.params.id,
        { fullName: req.body.title, 
          email: req.body.email,
          phoneNo: req.body.phoneNo,
          DOB: req.body.DOB,
          gender: req.body.gender,
          address: req.body.address,
          profilePic: req.body.profilePic,
          dateJoined: req.body.dateJoined,
          warehouseAssigned: req.body.warehouseAssigned,
          status: req.body.status,
          password: req.body.password,
          role: req.body.role,
          emName: req.body.emName,
          emRelation: req.body.emRelation,
          emNumber: req.body.emNumber
        },
        { new: true }
    )

    return res.status(204).json(staff);
}
