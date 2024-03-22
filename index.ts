import express, { Application, Response, Request } from "express";
import dotenv from 'dotenv'
dotenv.config()


const app: Application = express();


const port: number = Number(process.env.PORT) || 3000;

app.get('/', async (req: Request, res: Response) => {
    return res.json({ message: 'hello world' })
})


app.listen(port, () => {
    console.log('connect to server on port 3000')
})