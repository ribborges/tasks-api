import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';

import { findCategory } from '@/services/category';

async function userOwnsCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const currentId = get(req, 'identity.id') as unknown as ObjectId | null;

        if (!currentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const category = await findCategory(ObjectId.createFromHexString(id));

        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }

        if (category.userId.toString() !== currentId.toString()) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking category ownership:', error);
        res.status(500).json({ message: 'Error checking category ownership' });
    }
}

export { userOwnsCategory };