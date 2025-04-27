import  express  from "express";
import path from "path";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";
import { fetchQRCodeAndData } from "../../Application/StaffManagement/QRCode";

const QRRouter = express.Router();

QRRouter.route("/my-qr").get(authenticateToken, authorizeRole ([
    "Driver",
    "Maintenance Staff",
    "Other Staff"
]), fetchQRCodeAndData );

  export default QRRouter;