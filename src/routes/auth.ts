import { Router } from "express";

import { register } from "@/controllers/auth";

export default (router: Router) => {
    router.post("/auth/register", register);
};