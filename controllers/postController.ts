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
                        email: true
                    }
                }
            }
        });
        return res.json(posts);
    } catch (error) {
        return res.status(500).json(error)
    }
}


const createPost = async (req: Request, res: Response) => {
    const { title, content, userId } = req.body;


    try {

        if (!title && title == '') {
            return res.json({ message: 'title are required' })
        } else if (!content && content == '') {
            return res.json({ message: 'content are required' })
        } else if (!userId ?? userId == 0) {
            return res.json({ message: 'userid are required' })
        }

        const previousUser = await prisma.user.findFirst({
            where: { id: userId }
        });

        console.log(previousUser)

        if (!previousUser) {
            return res.json({ message: 'user are not found' })
        }

        const newPost = await prisma.article.create({
            data: {
                title,
                content,
                userId: userId
            }
        });

        return res.status(201).json({ message: 'post create successfull', newPost })

    } catch (error) {
        return res.status(500).json(error)
    }
}


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
        return res
          .status(401)
          .json({
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
export { getPosts, createPost, updatePost };