import { Router } from "express";

import auth from "./auth";
import user from "./user";
import category from "./category";
import task from "./task";

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    category(router);
    task(router);

    return router;
}