import { Router } from "express";

import { createTask, removeTask, getUserTasks, changeTask } from "@/controllers/task";

export default (router: Router) => {
    router.post("/task", createTask);
    router.get("/task/list", getUserTasks);
    router.patch("/task/:id", changeTask);
    router.delete("/task/:id", removeTask);
};