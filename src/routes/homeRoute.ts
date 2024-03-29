import { Router } from "express";
import { homePage } from "../controllers/homePageController.js";

const router = Router();

router.route("/").get(homePage);

export default router;
