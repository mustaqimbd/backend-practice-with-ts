/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,  // Enable cookies and other credentials to be sent in the request
  };

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", router)

app.get('/', async (req: Request, res: Response) => {

    res.send('Hello World!');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use(globalErrorHandler)

export default app