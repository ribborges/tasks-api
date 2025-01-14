import express from "express";
import cors from "cors";

import { connectDB } from "./database/operations";
import tasksRouter from "./routes/tasks";
import { appPort } from "./config/env";

// Set up the express app
const app = express();
const port = appPort || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use(tasksRouter);

// Start the server
async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();