import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { get, merge } from 'lodash';

import { getUserByToken } from '@/services/auth';
import { UserSchema } from '@/types/user';

async function isAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies["token"];

        if (!token) {
            res.status(401).send("Unauthorized");
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
        res.status(401).send("Unauthorized");
    }
}

const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentId = get(req, 'identity._id') as unknown as string;

        if (!currentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (currentId.toString() !== id) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking ownership:', error);
        res.status(500).json({ message: 'Error checking ownership' });
    }
};

export { isAuth, isOwner };