import { Router } from "express";

import auth from "./auth";
import tasks from "./tasks";

const router = Router();

export default (): Router => {
    auth(router);
    tasks(router);

    return router;
}