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
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, userId } = req.body;
    try {
        if (!id) {
            return res.status(401).json({ message: "post id is required" });
        }
        else if (!userId) {
            return res.status(401).json({ message: "user id is required" });
        }
        const findPost = yield prisma.article.findFirst({
            where: { id: Number(id) },
        });
        if (!findPost) {
            return res.status(401).json({ message: "post is not found!" });
        }
        const userAreValid = yield prisma.user.findFirst({
            where: { id: Number(userId) },
        });
        if ((userAreValid === null || userAreValid === void 0 ? void 0 : userAreValid.id) !== (findPost === null || findPost === void 0 ? void 0 : findPost.userId)) {
            return res.status(401).json({
                message: "you are not able to delete this post, 'YOUR ARE NOT AUTHOR THIS POST' ",
            });
        }
        const deletedPost = yield prisma.article.delete({
            where: { id: Number(id) },
        });
        if (!deletedPost) {
            return res.json({ message: "post are not delete" });
        }
        return res.status(200).json({ message: "post delete ok." });
    }
    catch (error) {
        return res.status(500).json({ message: "error from server ", error });
    }
});
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, content } = req.body;
    try {
        if (!userId) {
            return res.status(401).json({ message: "user id is required" });
        }
        else if (!postId) {
            return res.status(401).json({ message: "post id is required" });
        }
        else if (!content || content == "") {
            return res.status(401).json({ message: "post content is required" });
        }
        const findPost = yield prisma.article.findFirst({
            where: { id: Number(postId) },
        });
        if (!findPost) {
            return res.status(401).json({ message: "post is not found!" });
        }
        const userAreValid = yield prisma.user.findFirst({
            where: { id: Number(userId) },
        });
        if (!userAreValid) {
            return res
                .status(401)
                .json({ message: "user are not found, you are not valid user" });
        }
        const newComment = yield prisma.comment.create({
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
    }
    catch (error) {
        return res.status(500).json({ message: "error from sever", error });
    }
});
export { getPosts, createPost, updatePost, deletePost, createComment };
//# sourceMappingURL=postController.js.map