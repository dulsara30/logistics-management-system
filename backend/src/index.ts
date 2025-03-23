import express from "express";
import { Request, Response } from "express";
import { connectDB } from "./Infrastructure/db";
import staffRouter from "./API/StaffManagement/staff";
import cors from "cors";
import loginRouter from "./API/login/login";

const app = express();
app.use(express.json());
app.use('/upload', express.static('upload'));
app.use(cors());

connectDB();

app.use("/", loginRouter)
app.use("/staff", staffRouter);


const PORT = 8000

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

