/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors';
import express, { Request, Response } from 'express';

import notFound from './app/middlewares/notFound';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet System"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;