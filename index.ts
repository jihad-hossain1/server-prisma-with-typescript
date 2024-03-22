import express, { Application, Response, Request } from "express";
import dotenv from 'dotenv'
dotenv.config()


const app: Application = express();


const port: number = Number(process.env.PORT) || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'hello world' })
})


import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';



app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);




app.listen(port, () => {
    console.log(`connect to server on port ${port}`)
})