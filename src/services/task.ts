import { ObjectId } from "mongodb";
import { merge } from "lodash";

import client from "@/database/client";
import { dbName } from "@/database/operations";
import { TaskSchema } from "@/types/task";
import filterNullFields from "@/util/filterNullFields";

const collectionName = 'tasks';

async function findUserTasks(userId: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const tasks = await collection.find({ userId: userId }).toArray();

        return tasks; // Returns an array of task documents
    } catch (error) {
        console.error('Error getting all tasks:', error);
        throw new Error('Error getting all tasks');
    }
}

async function findTask(id: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const task = await collection.findOne({ _id: id });

        return task; // Returns the task document if found, or null if not
    } catch (error) {
        console.error('Error getting task by ID:', error);
        throw new Error('Error getting task by ID');
    }
}

async function insertTask(data: TaskSchema) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);

        const createdAt = new Date();

        merge(filteredData, { createdAt });

        const result = await collection.insertOne(filteredData);

        if (!result.acknowledged) throw new Error('Error creating task');

        return {
            _id: result.insertedId,
            ...data,
            createdAt
        }; // Returns the task document
    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Error creating task');
    }
}

async function updateTask(id: string, data: TaskSchema) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);

        merge(filteredData, { updatedAt: new Date() });

        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: filteredData }
        );

        return result; // Returns an UpdateResult object
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Error updating task');
    }
}

async function deleteTask(id: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: id });

        return result; // Returns a DeleteResult object
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Error deleting task');
    }
}

export { findUserTasks, findTask, insertTask, updateTask, deleteTask };