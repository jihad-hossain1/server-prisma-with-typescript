import { Request, Response } from "express";
import prisma from "../prisma/index.js";
import bcrypt from 'bcrypt'

const getAllUser = async (req: Request, res: Response) => {
    console.log("first")
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        return res.json(users);
    } catch (error) {
        return res.status(500).json(error)
    }
}


const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    console.log({ name, email, password });

    try {

        if (!name && name == '') {
            return res.json({ message: 'name are required' })
        } else if (!email && email == '') {
            return res.json({ message: 'email are required' })
        } else if (!password && password == '') {
            return res.json({ message: 'password are required' })
        }

        const previousUser = await prisma.user.findFirst({
            where: { email }
        });

        if (previousUser) {
            return res.json({ message: 'user email already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({ message: 'user register successfull', newUser })

    } catch (error) {
        return res.status(500).json(error)
    }
}


export const findUserWithPosts = async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> => {
    const { id } = req.params as { id: string }

    try {

        if (!id) {
            return res.status(401).json({ message: 'user id is required or not valid' })
        }

        if (id) {
            const findUser = await prisma.user.findFirst({
                where: { id: Number(id) }, select: {
                    id: true,
                    name: true,
                    email: true,
                    articles: true
                }
            })

            if (!findUser) {
                return res.status(401).json({ message: 'user are not found' })
            }

            return res.json(findUser)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export { getAllUser, registerUser }