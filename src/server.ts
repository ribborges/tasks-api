import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import router from '@/routes';
import { clientURL } from "@/config/env";
import { gracefulShutdownMiddleware } from "@/middleware/gracefulShutdown";

// Create and setup express app
const app = express();

app.use(cors({
    origin: clientURL,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(gracefulShutdownMiddleware);

app.use('/', router());

export default app;