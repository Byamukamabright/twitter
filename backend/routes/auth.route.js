import express from "express";
import { signup,login,logout,getMe,password,passform} from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js";
import { otpSender } from "../middleware/otpSender.js";
const router = express.Router();

router.get("/me",protectRoute,getMe);
router.post("/signup",otpSender,signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/reset/:mailLink",password);
router.get("/reset/:mailLink",passform)



export default router;