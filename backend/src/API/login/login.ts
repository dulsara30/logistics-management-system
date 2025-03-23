import express from "express";
import { login } from "../../Application/login/login";
import { authenticateToken, authorizeRole } from "../../middleware/authentication";

const loginRouter = express.Router();

loginRouter.route("/login").post(login);

export default loginRouter;