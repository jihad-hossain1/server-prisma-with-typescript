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

export { getPosts, createPost }