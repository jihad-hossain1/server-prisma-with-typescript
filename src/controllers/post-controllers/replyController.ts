import prisma from "prisma/index.js";
import { Request, Response } from "express";

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

export { createCommentReply, updateReply };
