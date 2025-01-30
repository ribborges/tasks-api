import { Router } from "express";

import { getLogguedUser, getAllUsers, removeUser, changeUser, changePassword } from "@/controllers/user";
import { isAuth, isOwner } from "@/middleware/auth";

export default (router: Router) => {
    router.get("/user", isAuth, getLogguedUser);
    router.get('/users', isAuth, getAllUsers);
    router.delete('/user/:id', isAuth, isOwner, removeUser);
    router.patch('/user/:id', isAuth, isOwner, changeUser);
    router.patch('/password/:id', isAuth, isOwner, changePassword);
};