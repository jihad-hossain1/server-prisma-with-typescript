import { Request, Response } from "express";
import prisma from "prisma/index.js";

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

export { createComment, updateComment, getCommentsByPostId };
