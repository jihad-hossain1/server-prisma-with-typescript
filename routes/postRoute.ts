import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/postController.js";

const router = Router();

router.route("/create-post").post(createPost);
router.route("/all-posts").get(getPosts);
router.route("/update-post").patch(updatePost);
router.route("/delete-post").delete(deletePost);

export default router;