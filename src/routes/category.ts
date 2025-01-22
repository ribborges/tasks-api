import { Router } from "express";

import { getUserCategories, createCategory, removeCategory, getCategory, changeCategory } from "@/controllers/category";

export default (router: Router) => {
    router.get("/category/list", getUserCategories);
    router.get("/category/:id", getCategory);
    router.post("/category", createCategory);
    router.put("/category/:id", changeCategory);
    router.delete("/category/:id", removeCategory);
};