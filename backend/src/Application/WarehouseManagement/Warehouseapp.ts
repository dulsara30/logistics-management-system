// Application/userService.ts
import Warehouse from "../../Infrastructure/schemas/WarehouseManagement/Warehouseschema";
import { Request, Response } from 'express';


// Read all Warehouse
export const getAllWarehouses = async () => {
  try {
    const warehouse = await Warehouse.find(); // fetch all warehouse from the collection
    return warehouse;
  } catch (error) {
    console.error("Error retrieving Warehouse:", error);
    throw new Error("Error retrieving Warehouse");
  }
};


// (read) get a warehouse by ID
export const getWarehouseById = async (Wname: string) => {
  try {
    return await Warehouse.findOne({ WarehouseID: Wname });  // This returns a single document instead of an array
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    throw new Error("Error fetching warehouse");
  }
}


export const createWarehouse = async (
  WarehouseID: String,
  StreetName: string,
  City: string,
  Province: string,
  SpecialInstruction: string,
  Description: string,
  Bulkysecsize: Number,
  Hazardoussecsize: Number,
  Perishablesecsize: Number,
  Sparesecsize: Number,
  Otheritems: Number,

) => {
  try {

    // Create a new warehouse instance or object with the provided data
    const W = new Warehouse({ WarehouseID,StreetName,City,Province,SpecialInstruction,Description,
      Bulkysecsize,Hazardoussecsize,Perishablesecsize,Sparesecsize,Otheritems
     });

    // Save the new warehouse to the database and return the result
    const savedwarehouse = await W.save();
    return savedwarehouse;

  } catch (error) {

    console.error("Error creating warehouse:", error);
    throw new Error("Error creating warehouse");

  }
};



// (update) update a warehouse by ID
export const updateWarehouse = async (
  WarehouseID: string,
  updates: {
    StreetName?: string,
    City?: string,
    Province?: string,
    SpecialInstruction?: string,
    Description?: string,
    Bulkysecsize?: number,
    Hazardoussecsize?: number,
    Perishablesecsize?: number,
    Sparesecsize?: number,
    Otheritems?: number,
  }
) => {
  try {
    // Find the warehouse by WarehouseID and update it with the new details
    const updatedWarehouse = await Warehouse.findOneAndUpdate(
      { WarehouseID: WarehouseID }, // match by WarehouseID
      { $set: updates },             // apply the updates
      { new: true }                  // return the updated document
    );

    if (!updatedWarehouse) {
      throw new Error("Warehouse not found");
    }

    return updatedWarehouse;
  } catch (error) {
    console.error("Error updating warehouse:", error);
    throw new Error("Error updating warehouse");
  }
};




// (delete) delete a warehouse by ID
export const deleteWarehouse = async (WarehouseID: string) => {
  try {
    // Find the warehouse by WarehouseID and delete it
    const deletedWarehouse = await Warehouse.findOneAndDelete({ WarehouseID });

    if (!deletedWarehouse) {
      throw new Error("Warehouse not found");
    }

    return deletedWarehouse;
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    throw new Error("Error deleting warehouse");
  }
};

