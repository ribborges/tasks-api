import express from "express";

import { createTask, deleteTask, getTasks, updateTask } from "../controllers/tasks";

const router = express.Router();

// Get all tasks
router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;