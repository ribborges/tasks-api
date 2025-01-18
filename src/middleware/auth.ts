import {  Request, Response, NextFunction } from 'express';
import { identity, merge } from 'lodash';

import { getUserByToken } from '@/services/auth';

async function isAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies["token"];

        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }

        const user = await getUserByToken(token);

        if (!user) {
            res.status(404).send("User not found" );
            return;
        }

        merge(req, { identity: user } );

        next();
    } catch (error) {
        console.error(error);
        res.status(401).send("Unauthorized");
    }
}

export { isAuth };