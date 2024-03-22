import { Router } from "express";
import { createPost, getPosts } from "../controllers/postController.js";

const router = Router();


router.route('/create-post').post(createPost);
router.route('/all-posts').get(getPosts);

export default router;