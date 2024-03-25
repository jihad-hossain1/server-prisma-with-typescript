import { Router } from "express";
import { createComment, createPost, deletePost, getPosts, updateComment, updatePost, } from "../controllers/postController.js";
const router = Router();
router.route("/create-post").post(createPost);
router.route("/all-posts").get(getPosts);
router.route("/update-post").patch(updatePost);
router.route("/delete-post").delete(deletePost);
router.route("/create-comment").post(createComment);
router.route("/update-comment").patch(updateComment);
export default router;
//# sourceMappingURL=postRoute.js.map