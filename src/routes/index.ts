import { Router } from "express";

import auth from "./modules/auth";
import user from "./modules/user";
import category from "./modules/category";
import task from "./modules/task";

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    category(router);
    task(router);

    return router;
}