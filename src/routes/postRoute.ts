import { Router } from "express";
// import {
//   createCommentReply,
//   updateReply,
// } from "../controllers/post-controllers/replyController.js";
// import {
//   createComment,
//   getCommentsByPostId,
//   updateComment,
// } from "../controllers/post-controllers/commentControllers.js";
// import {
//   createCommentReply,
//   updateReply,
// } from "controllers/post-controllers/replyController.js";
import {
  createPost,
  createPostMany,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post-controllers/postController.js";
import { getCommentsByPostId } from "controllers/post-controllers/commentControllers.js";

const router = Router();

router.route("/create-post").post(createPost);
router.route("/all-posts").get(getPosts);
router.route("/update-post").patch(updatePost);
router.route("/delete-post").delete(deletePost);
router.route("/create-many").post(createPostMany);

// router.route("/:id/comments").get(getCommentsByPostId);
// router.route("/create-comment").post(createComment);
// router.route("/update-comment").patch(updateComment);

// router.route("/comments/create-reply").post(createCommentReply);
// router.route("/comments/:commentId/replies").patch(updateReply);


export default router;
