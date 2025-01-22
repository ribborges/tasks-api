import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { findTask, findUserTasks, updateTask, insertTask, deleteTask } from '@/services/task';

async function createTask(req: Request, res: Response) {
    try {
        const { categoryId, userId, name, description, status, isImportant } = req.body;

        if (!categoryId || !userId || !name || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const task = await insertTask({
            categoryId: ObjectId.createFromHexString(categoryId),
            userId: ObjectId.createFromHexString(userId),
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
        const { userId } = req.body;

        if (!userId) {
            res.status(400).send('Missing user ID');
            return;
        }

        const tasks = await findUserTasks(userId);

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

        const task = await findTask(id);

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

        const result = await deleteTask(id);

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

export { createTask, getUserTasks, changeTask, removeTask };