import { Router } from "express";

import { createTask, removeTask, getUserTasks, changeTask, getTask } from "@/controllers/task";
import { isAuth } from "@/middleware/auth";
import { userOwnsTask } from "@/middleware/task";

export default (router: Router) => {
    router.post("/task", isAuth, createTask);
    router.get("/task/:id", isAuth, userOwnsTask, getTask);
    router.get("/task/list", isAuth, getUserTasks);
    router.patch("/task/:id", isAuth, userOwnsTask, changeTask);
    router.delete("/task/:id", isAuth, userOwnsTask, removeTask);
};