import express from "express";
import cors from "cors";

import router from '@/routes';

import { appPort } from "./config/env";
import cookieParser from 'cookie-parser';

// Set up the express app
const app = express();
const port = appPort || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', router());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});