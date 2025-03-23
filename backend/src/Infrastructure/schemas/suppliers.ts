/*const suppliers = [
    {
        _id: "1",
        name: "sName",
        items: ["item 1", "item 2", "item 3"],
        quantity: ["Qty", "Qty", "Qty"],
        price: ["Price", "Price", "Price"],
        date: "2025-03-17",
      },
      {
        _id: "2",
        name: "sName",
        items: ["item 1", "item 2"],
        quantity: ["Qty", "Qty"],
        price: ["Price", "Price"],
        date: "2025-03-15",
      },
    ];
export default suppliers;*/

import mongoose from "mongoose";
import { title } from "process";


const supplierSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },

    email:{
        type:String,
        required: true
    },

    contact:{
        type: String,
        required: true
    },

    items:{
        type:[String],
        required: true
    },

    quantity:{
        type:[Number],
        required: true
    },

    price:{
        type:[Number],
        required: true
    },

    date:{
        type:String,
        required: true
    },
});

const supplier= mongoose.model("supplier", supplierSchema);
export default supplier;