import { Router } from "express";

import { login, logout, register, status } from "@/controllers/auth";

export default (router: Router) => {
    router.post("/auth/register", register);
    router.post("/auth/login", login);
    router.post("/auth/logout", logout);
    router.get("/auth/status", status);
};