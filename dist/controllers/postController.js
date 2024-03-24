var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../prisma/index.js";
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("first")
    try {
        const posts = yield prisma.article.findMany({
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
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content, userId } = req.body;
    try {
        if (!title && title == '') {
            return res.json({ message: 'title are required' });
        }
        else if (!content && content == '') {
            return res.json({ message: 'content are required' });
        }
        else if ((_a = !userId) !== null && _a !== void 0 ? _a : userId == 0) {
            return res.json({ message: 'userid are required' });
        }
        const previousUser = yield prisma.user.findFirst({
            where: { id: userId }
        });
        console.log(previousUser);
        if (!previousUser) {
            return res.json({ message: 'user are not found' });
        }
        const newPost = yield prisma.article.create({
            data: {
                title,
                content,
                userId: userId
            }
        });
        return res.status(201).json({ message: 'post create successfull', newPost });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, userId, id } = req.body;
    try {
        if (title == "") {
            return res.status(401).json({ message: "title are empty not allow" });
        }
        else if (content == "") {
            return res.status(401).json({ message: "content are empty not allow" });
        }
        else if (userId == 0 || !userId) {
            return res.status(401).json({ message: "userId are empty not allow" });
        }
        else if (title == 0 || !id) {
            return res.status(401).json({ message: "postid are empty not allow" });
        }
        const userAreValid = yield prisma.user.findFirst({
            where: { id: Number(userId) },
        });
        const userPost = yield prisma.article.findFirst({ where: { id } });
        if (!userAreValid) {
            return res
                .status(400)
                .json({ message: "user are not valid for update this post" });
        }
        else if (!userPost) {
            return res.status(401).json({ message: "post are not found!" });
        }
        else if (userPost.userId !== userId) {
            return res
                .status(401)
                .json({
                message: 'You are not able change to this content, cause "YOU ARE NOT AUTHOR"',
            });
        }
        const update = yield prisma.article.update({
            where: {
                id: id,
            },
            data: {
                title,
                content,
            },
        });
        return res.status(200).json({ post: update, message: "update ok" });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
export { getPosts, createPost, updatePost };
//# sourceMappingURL=postController.js.map