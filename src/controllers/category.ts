import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { get } from 'lodash';

import { insertCategory, deleteCategory, findUserCategories, findCategory, updateCategory } from '@/services/category';
import { CategorySchema } from '@/types/category';

async function getUserCategories(req: Request, res: Response) {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).send('Missing user ID');
            return;
        }

        const categories = await findUserCategories(ObjectId.createFromHexString(userId as string)) as ({ _id: ObjectId } & CategorySchema)[];

        res.status(200).send(categories.map(category => ({
            id: category._id,
            userId: category.userId,
            name: category.name,
            color: category.color,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        })));
    } catch (error) {
        res.status(500).send('Error getting all tasks');
    }
}

async function getCategory(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send('Missing category ID');
            return;
        }

        const category = await findCategory(ObjectId.createFromHexString(id));

        if (!category) {
            res.status(404).send('Category not found');
            return;
        }

        res.status(200).send(category);
    } catch (error) {
        res.status(500).send('Error getting category');
    }
}

async function createCategory(req: Request, res: Response) {
    try {
        const id = get(req, 'identity.id') as unknown as ObjectId | null;

        if (!id) {
            res.status(401).send('Unauthorized');
            return;
        }

        const { name, color } = req.body;

        if (!name || !color) {
            res.status(400).send('Missing required fields');
            return;
        }

        const category = await insertCategory({
            userId: id,
            name,
            color
        });

        res.status(201).json({
            id: category._id,
            userId: category.userId,
            name: category.name,
            color: category.color
        });
    } catch (error) {
        res.status(500).send('Error creating category');
    }
}

async function changeCategory(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        if (!id) {
            res.status(400).send('Missing category ID');
            return;
        }

        const category = await findCategory(ObjectId.createFromHexString(id));

        if (!category) {
            res.status(404).send('Category not found');
            return;
        }

        await updateCategory(ObjectId.createFromHexString(id), {
            name,
            color
        });

        res.status(200).send('Category updated successfully');
    } catch (error) {
        res.status(500).send('Error updating category');
    }
}

async function removeCategory(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send('Missing category ID');
            return;
        }

        const result = await deleteCategory(ObjectId.createFromHexString(id));

        if (result.deletedCount === 0) {
            res.status(404).send('Category not found');
            return;
        }

        res.status(200).send('Category deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting category');
    }
}

export { getUserCategories, getCategory, createCategory, changeCategory, removeCategory };