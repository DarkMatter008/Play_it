import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register" ,(req,res) => {
}).post(registerUser)
// router.route("/login").post(loginUser)





export default router