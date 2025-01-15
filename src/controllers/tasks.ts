import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import client from '@/database/client';

export const createTask = async (req: Request, res: Response) => {
    try {
        // Extract task data from request body
        const { name, isCompleted } = req.body;

        // Connect to the MongoDB database
        const database = client.db('task-manager');
        const collection = database.collection('tasks');

        // Create a new task document
        const newTask = {
            name,
            isCompleted: false
        };

        // Insert the new task into the database
        const result = await collection.insertOne(newTask);

        // Send a success response
        res.status(201).json({ message: 'Task created successfully', id: result.insertedId});
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getTasks = async (req: Request, res: Response) => {
    try {
        const database = client.db('task-manager');
        const collection = database.collection('tasks');
        const tasks = await collection.find().toArray();
        const convertedTasks = tasks.map(task => {
            const { _id, ...rest } = task;
            return { id: _id.toString(), ...rest };
        }).reverse();
        res.status(200).send(convertedTasks);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Extract updated task data from request body
        const updatedTaskData = req.body;

        // Connect to the MongoDB database
        const database = client.db('task-manager');
        const collection = database.collection('tasks');

        // Update the task in the database based on the provided task ID
        const result = await collection.updateOne(
            { _id: new ObjectId(taskId) }, // Filter
            { $set: updatedTaskData }   // Update
        );

        // Check if the task was found and updated
        if (result.modifiedCount === 1) {
            res.json({ message: 'Task updated successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const completeTask = async (req: Request, res: Response) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Connect to the MongoDB database
        const database = client.db('task-manager');
        const collection = database.collection('tasks');

        // Update the task in the database based on the provided task ID
        const result = await collection.updateOne(
            { _id: new ObjectId(taskId) }, // Filter
            { $set: { isCompleted: true } }   // Update
        );

        // Check if the task was found and updated
        if (result.modifiedCount === 1) {
            res.json({ message: 'Task completed successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Connect to the MongoDB database
        const database = client.db('task-manager');
        const collection = database.collection('tasks');

        // Delete the task from the database based on the provided task ID
        const result = await collection.deleteOne({ _id: new ObjectId(taskId) });

        // Check if the task was found and deleted
        if (result.deletedCount === 1) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}