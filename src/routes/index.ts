import { Router } from "express";

import auth from "./auth";
import user from "./user";
import tasks from "./tasks";

const router = Router();

export default (): Router => {
    auth(router);
    user(router);
    tasks(router);

    return router;
}