import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import router from '@/routes';
import { appPort } from "@/config/env";
import { connectDB } from "@/database/operations";

// Set up the express app
const app = express();
const port = appPort || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', router());

connectDB();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});