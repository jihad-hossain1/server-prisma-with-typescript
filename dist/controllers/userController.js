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
import bcrypt from 'bcrypt';
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
    try {
        const users = yield prisma.user.findMany();
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    try {
        if (!name && name == '') {
            return res.json({ message: 'name are required' });
        }
        else if (!email && email == '') {
            return res.json({ message: 'email are required' });
        }
        else if (!password && password == '') {
            return res.json({ message: 'password are required' });
        }
        const previousUser = yield prisma.user.findFirst({
            where: { email }
        });
        if (previousUser) {
            return res.json({ message: 'user email already exist' });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        return res.status(201).json({ message: 'user register successfull', newUser });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
export { getAllUser, registerUser };
//# sourceMappingURL=userController.js.map