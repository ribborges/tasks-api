import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';

import { findTask } from '@/services/task';

async function userOwnsTask(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const currentId = get(req, 'identity.id');

        if (!currentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const task = await findTask(ObjectId.createFromHexString(id));

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        if (task.userId.toString() !== currentId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking task ownership:', error);
        res.status(500).json({ message: 'Error checking task ownership' });
    }
}

export { userOwnsTask };