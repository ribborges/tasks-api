import { Router } from "express";

import { getLogguedUser, getAllUsers } from "@/controllers/user";
import { isAuth } from "@/middleware/auth";

export default (router: Router) => {
    router.get("/user", isAuth, getLogguedUser);
    router.get('/users', isAuth, getAllUsers);
};