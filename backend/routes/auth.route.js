import express from "express";
import { signup,login,logout,getMe,password} from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/me",protectRoute,getMe);
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/reset",password)


export default router;