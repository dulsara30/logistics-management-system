

import mongoose from "mongoose";
import { title } from "process";


const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    items: {
        type: [String],
        required: true
    },

    quantity: {
        type: [Number],
        required: true
    },

    price: {
        type: [Number],
        required: true
    },

    date: {
        type: String,
        required: true
    },
});

const supplier = mongoose.model("supplier", supplierSchema);
export default supplier;