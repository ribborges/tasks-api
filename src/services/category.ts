import { ObjectId } from "mongodb";
import { merge } from "lodash";

import client from "@/database/client";
import { dbName } from "@/database/operations";
import { CategorySchema } from "@/types/category";
import filterNullFields from "@/util/filterNullFields";

const collectionName = 'categories';

async function findUserCategories(userId: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const categories = await collection.find({ userId: userId }).toArray();

        return categories; // Returns an array of category documents
    } catch (error) {
        console.error('Error getting all categories:', error);
        throw new Error('Error getting all categories');
    }
}

async function findCategory(id: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const category = await collection.findOne({ _id: id });

        return category; // Returns the category document
    } catch (error) {
        console.error('Error getting category:', error);
        throw new Error('Error getting category');
    }
}

async function insertCategory(data: CategorySchema) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);
        
        merge(filteredData, { createdAt: new Date() });

        const result = await collection.insertOne(filteredData);

        if (!result.acknowledged) throw new Error('Error creating task');

        return {
            _id: result.insertedId,
            ...data
        }; // Returns the category document
    } catch (error) {
        console.error('Error creating category:', error);
        throw new Error('Error creating category');
    }
}

async function updateCategory(id: ObjectId, data: { name: string, color: string }) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);

        merge(filteredData, { updatedAt: new Date() });

        const result = await collection.updateOne(
            { _id: id },
            { $set: filteredData }
        );

        return result; // Returns the update result
    } catch (error) {
        console.error('Error updating category:', error);
        throw new Error('Error updating category');
    }
}

async function deleteCategory(id: ObjectId) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: id });

        return result; // Returns the delete result
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Error deleting category');
    }
}

export { findUserCategories, findCategory, insertCategory, updateCategory, deleteCategory };