var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ message: 'hello world' });
}));
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.listen(port, () => {
    console.log(`connect to server on port ${port}`);
});
//# sourceMappingURL=index.js.map