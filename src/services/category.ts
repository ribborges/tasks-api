import { ObjectId } from "mongodb";
import { merge } from "lodash";

import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";
import { CategorySchema } from "@/types/category";
import filterNullFields from "@/util/filterNullFields";

const collectionName = 'categories';

async function findUserCategories(userId: string) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const categories = await collection.find({ userId: ObjectId.createFromHexString(userId) }).toArray();

        console.log('Categories:', categories);
        return categories; // Returns an array of category documents
    } catch (error) {
        console.error('Error getting all categories:', error);
        throw new Error('Error getting all categories');
    } finally {
        await closeDB();
    }
}

async function findCategory(id: ObjectId) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const category = await collection.findOne({ _id: id });

        return category; // Returns the category document
    } catch (error) {
        console.error('Error getting category:', error);
        throw new Error('Error getting category');
    } finally {
        await closeDB();
    }
}

async function insertCategory(data: CategorySchema) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(data);

        if (!result.acknowledged) throw new Error('Error creating task');

        return {
            _id: result.insertedId,
            ...data
        }; // Returns the category document
    } catch (error) {
        console.error('Error creating category:', error);
        throw new Error('Error creating category');
    } finally {
        await closeDB();
    }
}

async function updateCategory(id: ObjectId, data: { name: string, color: string }) {
    try {
        await connectDB();
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
    } finally {
        await closeDB();
    }
}

async function deleteCategory(id: ObjectId) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: id });

        return result; // Returns the delete result
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Error deleting category');
    } finally {
        await closeDB();
    }
}

export { findUserCategories, findCategory, insertCategory, updateCategory, deleteCategory };