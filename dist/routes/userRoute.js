import { Router } from "express";
import { findUserWithPosts, getAllUser, registerUser } from "../controllers/userController.js";
const router = Router();
router.route('/all-users').get(getAllUser);
router.route('/register').post(registerUser);
router.route('/singleUser-posts/:id').get(findUserWithPosts);
export default router;
//# sourceMappingURL=userRoute.js.map