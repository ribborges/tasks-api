import { Router } from "express";

import { completeTask, createTask, deleteTask, getTasks, updateTask } from "@/controllers/tasks";

export default (router: Router) => {
    router.post("/tasks", createTask);
    router.get("/tasks", getTasks);
    router.put("/tasks/:id", updateTask);
    router.put("/complete-task/:id", completeTask);
    router.delete("/tasks/:id", deleteTask);
};