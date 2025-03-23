import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import { connectDB } from "./Infrastructure/db";
import { resolve } from "path";
import { json } from "stream/consumers";
import { create } from "domain";
import suppliersRouter from "./API/SpplierManagement/suppliers";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use("/suppliers", suppliersRouter);


const PORT = 8000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}.`));

//! Restfull API
