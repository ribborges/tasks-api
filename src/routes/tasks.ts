import express from "express";

import { getTasks } from "../controllers/tasks";

const router = express.Router();

// Get all tasks
router.get("/getTasks", getTasks);

export default router;