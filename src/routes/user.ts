import { Router } from "express";

import { getLogguedUser, getAllUsers, deleteUser, updateUser } from "@/controllers/user";
import { isAuth, isOwner } from "@/middleware/auth";

export default (router: Router) => {
    router.get("/user", isAuth, getLogguedUser);
    router.get('/users', isAuth, getAllUsers);
    router.delete('/users/:id', isAuth, isOwner, deleteUser);
    router.patch('/users/:id', isAuth, isOwner, updateUser);
};