import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { get, merge } from 'lodash';

import { getUserByToken } from '@/services/auth';
import { UserSchema } from '@/types/user';

async function isAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies["token"];

        if (!token) {
            res.status(401).send("Unauthorized: Missing token");
            return;
        }

        const user = await getUserByToken(token) as ({ _id: ObjectId } & UserSchema) | null;

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const { _id, ...userWithoutId } = user;
        merge(req, { identity: { id: _id, ...userWithoutId } });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentId = get(req, 'identity.id') as unknown as ObjectId | null;

        if (!currentId) {
            res.status(401).send('Unauthorized');
            return;
        }

        if (currentId.toString() !== id) {
            res.status(403).send('Forbidden');
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking ownership:', error);
        res.status(500).send('Error checking ownership');
    }
};

export { isAuth, isOwner };