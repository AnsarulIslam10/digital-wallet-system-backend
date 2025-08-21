/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors';
import express, { Request, Response } from 'express';

import notFound from './app/middlewares/notFound';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { envVars } from './app/config/env';
const app = express()
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1", router)
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet System"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;