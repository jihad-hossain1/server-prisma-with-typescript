import { Router } from "express";
import { createPost, getPosts, updatePost, } from "../controllers/postController.js";
const router = Router();
router.route("/create-post").post(createPost);
router.route("/all-posts").get(getPosts);
router.route("/update-post").patch(updatePost);
export default router;
//# sourceMappingURL=postRoute.js.map