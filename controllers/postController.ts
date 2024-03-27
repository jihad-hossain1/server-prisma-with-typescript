import { Request, Response } from "express";
import prisma from "../prisma/index.js";

const getPosts = async (req: Request, res: Response) => {
  // console.log("first")
  try {
    const posts = await prisma.article.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createPost = async (req: Request, res: Response) => {
  const { title, content, userId } = req.body;

  try {
    if (!title && title == "") {
      return res.json({ message: "title are required" });
    } else if (!content && content == "") {
      return res.json({ message: "content are required" });
    } else if (!userId ?? userId == 0) {
      return res.json({ message: "userid are required" });
    }

    const previousUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    console.log(previousUser);

    if (!previousUser) {
      return res.json({ message: "user are not found" });
    }

    const newPost = await prisma.article.create({
      data: {
        title,
        content,
        userId: userId,
      },
    });

    return res
      .status(201)
      .json({ message: "post create successfull", newPost });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const { title, content, userId, id } = req.body;
  try {
    if (title == "") {
      return res.status(401).json({ message: "title are empty not allow" });
    } else if (content == "") {
      return res.status(401).json({ message: "content are empty not allow" });
    } else if (userId == 0 || !userId) {
      return res.status(401).json({ message: "userId are empty not allow" });
    } else if (title == 0 || !id) {
      return res.status(401).json({ message: "postid are empty not allow" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    const userPost = await prisma.article.findFirst({ where: { id } });

    if (!userAreValid) {
      return res
        .status(400)
        .json({ message: "user are not valid for update this post" });
    } else if (!userPost) {
      return res.status(401).json({ message: "post are not found!" });
    } else if (userPost.userId !== userId) {
      return res.status(401).json({
        message:
          'You are not able change to this content, cause "YOU ARE NOT AUTHOR"',
      });
    }

    const update = await prisma.article.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({ post: update, message: "update ok" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { id, userId } = req.body;
  try {
    if (!id) {
      return res.status(401).json({ message: "post id is required" });
    } else if (!userId) {
      return res.status(401).json({ message: "user id is required" });
    }

    const findPost = await prisma.article.findFirst({
      where: { id: Number(id) },
    });

    if (!findPost) {
      return res.status(401).json({ message: "post is not found!" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (userAreValid?.id !== findPost?.userId) {
      return res.status(401).json({
        message:
          "you are not able to delete this post, 'YOUR ARE NOT AUTHOR THIS POST' ",
      });
    }

    const deletedPost = await prisma.article.delete({
      where: { id: Number(id) },
    });

    if (!deletedPost) {
      return res.json({ message: "post are not delete" });
    }

    return res.status(200).json({ message: "post delete ok." });
  } catch (error) {
    return res.status(500).json({ message: "error from server ", error });
  }
};

const createComment = async (req: Request, res: Response) => {
  const { userId, postId, content } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ message: "user id is required" });
    } else if (!postId) {
      return res.status(401).json({ message: "post id is required" });
    } else if (!content || content == "") {
      return res.status(401).json({ message: "post content is required" });
    }

    const findPost = await prisma.article.findFirst({
      where: { id: Number(postId) },
    });

    if (!findPost) {
      return res.status(401).json({ message: "post is not found!" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!userAreValid) {
      return res
        .status(401)
        .json({ message: "user are not found, you are not valid user" });
    }

    const newComment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
    });

    if (!newComment) {
      return res.status(401).json({ message: "comment are not create!" });
    }

    return res
      .status(201)
      .json({ message: "comment create ok.", comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: "error from sever", error });
  }
};

const getCommentsByPostId = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    if (!id) {
      return res.status(401).json({ message: "must be post id is required" });
    }

    const isPostAreValid = await prisma.article.findFirst({
      where: { id: Number(id) },
    });

    if (!isPostAreValid) {
      return res.status(400).json({ message: "post are not found" });
    }

    const commentsByPost = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        user: {
          select: {
            name: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            userId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.json(commentsByPost);
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "you got an error from server" });
  }
};

const updateComment = async (req: Request, res: Response) => {
  const { content, userId, postId, id } = req.body;
  try {
    if (content == "") {
      return res.status(401).json({ message: "content are empty not allow" });
    } else if (userId == 0 || !userId) {
      return res.status(401).json({ message: "userId are empty not allow" });
    } else if (!postId) {
      return res.status(401).json({ message: "postid are empty not allow" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    const postComment = await prisma.comment.findFirst({
      where: { id: Number(id) },
    });

    if (!userAreValid) {
      return res
        .status(400)
        .json({ message: "user are not valid for update this post" });
    } else if (!postComment) {
      return res.status(401).json({ message: "post are not found!" });
    } else if (postComment.userId !== Number(userId)) {
      return res.status(401).json({
        message:
          'You are not able change to this content, cause "YOU ARE NOT AUTHOR"',
      });
    }

    const update = await prisma.comment.update({
      where: {
        id: Number(id),
      },
      data: {
        content,
      },
    });

    if (!update) {
      return res.status(502).json({ message: "comment are not updated" });
    }

    return res.status(200).json({ comment: update, message: "update ok" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createCommentReply = async (req: Request, res: Response) => {
  const { userId, commentId, content } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ message: "user id is required" });
    } else if (!commentId) {
      return res.status(401).json({ message: "post id is required" });
    } else if (!content || content == "") {
      return res.status(401).json({ message: "post content is required" });
    }

    const findPostComment = await prisma.comment.findFirst({
      where: { id: Number(commentId) },
    });

    if (!findPostComment) {
      return res.status(401).json({ message: "post comment is not found!" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    if (!userAreValid) {
      return res
        .status(401)
        .json({ message: "user are not found, you are not valid user" });
    }

    const newCommentReply = await prisma.reply.create({
      data: {
        userId,
        commentId,
        content,
      },
    });

    if (!newCommentReply) {
      return res.status(401).json({ message: "reply are not create!" });
    }

    return res
      .status(201)
      .json({ message: "reply create ok.", reply: newCommentReply });
  } catch (error) {
    return res.status(500).json({ message: "error from sever", error });
  }
};

const updateReply = async (req: Request, res: Response) => {
  const { content, userId, id } = req.body;
  const { commentId } = req.params as { commentId: string };

  try {
    if (content == "") {
      return res.status(401).json({ message: "content are empty not allow" });
    } else if (userId == 0 || !userId) {
      return res.status(401).json({ message: "userId are empty not allow" });
    } else if (!commentId) {
      return res.status(401).json({ message: "commentId are empty not allow" });
    }

    const userAreValid = await prisma.user.findFirst({
      where: { id: Number(userId) },
    });

    const commentReply = await prisma.reply.findFirst({
      where: { id: Number(id) },
    });

    if (!userAreValid) {
      return res
        .status(400)
        .json({ message: "user are not valid for update this post" });
    } else if (!commentReply) {
      return res.status(401).json({ message: "reply are not found!" });
    } else if (commentReply.userId !== Number(userId)) {
      return res.status(401).json({
        message:
          'You are not able change to this content, cause "YOU ARE NOT AUTHOR"',
      });
    }

    const update = await prisma.reply.update({
      where: {
        id: Number(id),
      },
      data: {
        content,
      },
    });

    if (!update) {
      return res.status(502).json({ message: "reply are not updated" });
    }

    return res
      .status(200)
      .json({ updatedContent: update.content, message: "update ok" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const createPostMany = async (req: Request, res: Response) => {
  const { posts } = req.body;

  try {
    const findIds = posts?.map((item: { id: number }) => item.id);

    const mainPosts = await prisma.article.findMany();

    var filtered = mainPosts.filter((item) => findIds.indexOf(item.id) !== -1);

    console.log(filtered);
    const findManyPosts = await prisma.article.findMany({
      where: { id: findIds[0] },
    });

    // const createPosts = await prisma.article.createMany({ data: filtered });

    return res.status(201).json({ message: "ok", findManyPosts });
  } catch (error) {
    res.status(500).json({ message: "error from server", error });
  }
};

export {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  createCommentReply,
  updateReply,
  getCommentsByPostId,
  createPostMany,
};
