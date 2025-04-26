import  express  from "express";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";

const QRRouter = express.Router();

QRRouter.route("/my-qr").get(authenticateToken, authorizeRole ([
    "Driver",
    "Maintenance staff",
    "Other Staff"
]), );