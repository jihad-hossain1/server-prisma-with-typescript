import { Router } from "express";
import { getAllUser, registerUser } from "../controllers/userController.js";

const router = Router()

router.route('/all-users').get(getAllUser);
router.route('/register').post(registerUser);

export default router