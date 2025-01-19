import { Router } from "express";

import { getLogguedUser, getAllUsers, deleteUser, updateUser, updatePassword } from "@/controllers/user";
import { isAuth, isOwner } from "@/middleware/auth";

export default (router: Router) => {
    router.get("/user", isAuth, getLogguedUser);
    router.get('/user/list', isAuth, getAllUsers);
    router.delete('/user/:id', isAuth, isOwner, deleteUser);
    router.patch('/user/:id', isAuth, isOwner, updateUser);
    router.patch('/user/password/:id', isAuth, isOwner, updatePassword);
};