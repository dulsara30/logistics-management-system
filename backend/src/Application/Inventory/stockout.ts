
import { Request, Response } from "express";
import inventory from "../../Infrastructure/schemas/InventoryManagement";

export const stockoutInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity }: { quantity: number } = req.body;

    // Validate input
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      res.status(400).json({ error: "Quantity must be a positive number" });
      return;
    }

    // Find the item
    const item = await inventory.findById(id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    // Validate quantity against available stock
    if (quantity > item.quantity) {
      res.status(400).json({ error: `Requested quantity (${quantity}) exceeds available stock (${item.quantity})` });
      return;
    }

    // Update quantity
    item.quantity -= quantity;
    item.updatedIn = new Date();

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (err: any) {
    console.error("Error during stockout:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};