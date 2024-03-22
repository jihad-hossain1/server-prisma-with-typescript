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
export { getPosts, createPost };
//# sourceMappingURL=postController.js.map