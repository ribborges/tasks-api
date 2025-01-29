import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { get } from 'lodash';

import { findTask, findUserTasks, updateTask, insertTask, deleteTask } from '@/services/task';

async function getTask(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send('Missing task ID');
            return;
        }

        const task = await findTask(ObjectId.createFromHexString(id));

        if (!task) {
            res.status(404).send('Task not found');
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error getting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function createTask(req: Request, res: Response) {
    try {
        const { id } = get(req, 'identity', { id: null });

        if (!id) {
            res.status(401).send('Unauthorized');
            return;
        }

        const { categoryId, name, description, status, isImportant } = req.body;

        if (!categoryId || !name || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        if (status !== "pending" || "completed" || "in-progress") {
            res.status(400).json({ message: 'Invalid status' });
            return;
        }

        const task = await insertTask({
            categoryId: ObjectId.createFromHexString(categoryId),
            userId: id,
            name,
            description,
            status,
            isImportant
        })

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function getUserTasks(req: Request, res: Response) {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).send('Missing user ID');
            return;
        }

        const tasks = await findUserTasks(ObjectId.createFromHexString(userId as string));

        res.status(200).json(tasks);
    } catch (error: any) {
        console.error('Error getting user tasks:', error);
        res.status(500).send('Internal server error');
    }
}

async function changeTask(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { categoryId, name, description, status, isImportant } = req.body;

        const task = await findTask(ObjectId.createFromHexString(id));

        if (!task) {
            res.status(404).send('Task not found');
            return;
        }

        await updateTask(id, {
            categoryId: categoryId ? ObjectId.createFromHexString(categoryId) : task.categoryId,
            name,
            description,
            status,
            isImportant
        });

        res.status(200).send('Task updated successfully');
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function removeTask(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send('Missing task ID');
            return;
        }

        const result = await deleteTask(ObjectId.createFromHexString(id));

        if (result.deletedCount === 0) {
            res.status(404).send('Task not found');
            return;
        }

        res.status(200).send('Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal server error');
    }
}

export { getTask, createTask, getUserTasks, changeTask, removeTask };