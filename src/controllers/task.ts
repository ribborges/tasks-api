import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { get } from 'lodash-es';

import { findTask, findUserTasks, updateTask, insertTask, deleteTask } from '@/services/task';
import { TaskSchema, TaskStatus } from '@/types/task';

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
        const id = get(req, 'identity.id') as unknown as ObjectId | null;

        if (!id) {
            res.status(401).send('Unauthorized');
            return;
        }

        const { categoryId, name, description, dueDate, isImportant } = req.body;
        const status = req.body.status as unknown as TaskStatus;

        if (!categoryId || !name || !status) {
            res.status(400).send('Missing required fields');
            return;
        }

        if (status !== "pending" && status !== "completed" && status !== "in-progress") {
            res.status(400).send('Invalid status');
            return;
        }

        const task = await insertTask({
            categoryId: ObjectId.createFromHexString(categoryId),
            userId: id,
            name,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            status,
            isImportant
        })

        res.status(201).json({
            id: task._id,
            categoryId: task.categoryId,
            userId: task.userId,
            name: task.name,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            isImportant: task.isImportant,
            createdAt: task.createdAt
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal server error');
    }
}

async function getUserTasks(req: Request, res: Response) {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).send('Missing user ID');
            return;
        }

        const tasks = await findUserTasks(ObjectId.createFromHexString(userId as string)) as ({ _id: ObjectId } & TaskSchema)[];

        if (!tasks) {
            res.status(404).send('Tasks not found');
            return;
        }

        res.status(200).json(tasks.map(task => ({
            id: task._id,
            categoryId: task.categoryId,
            userId: task.userId,
            name: task.name,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
            isImportant: task.isImportant,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        })));
    } catch (error: any) {
        console.error('Error getting user tasks:', error);
        res.status(500).send('Internal server error');
    }
}

async function changeTask(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { categoryId, name, description, dueDate, status, isImportant } = req.body;

        const task = await findTask(ObjectId.createFromHexString(id));

        if (!task) {
            res.status(404).send('Task not found');
            return;
        }

        await updateTask(id, {
            categoryId: categoryId ? ObjectId.createFromHexString(categoryId) : task.categoryId,
            name,
            description,
            dueDate: dueDate ? new Date(dueDate) : task.dueDate,
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