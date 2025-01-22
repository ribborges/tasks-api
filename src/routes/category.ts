import { Router } from "express";

import { getUserCategories, createCategory, removeCategory, getCategory, changeCategory } from "@/controllers/category";
import { isAuth } from "@/middleware/auth";
import { userOwnsCategory } from "@/middleware/category";

export default (router: Router) => {
    router.get("/category/list", isAuth, getUserCategories);
    router.get("/category/:id", isAuth, userOwnsCategory, getCategory);
    router.post("/category", isAuth, createCategory);
    router.put("/category/:id", isAuth, userOwnsCategory, changeCategory);
    router.delete("/category/:id", isAuth, userOwnsCategory, removeCategory);
};