import { ObjectId } from "mongodb";

import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";
import filterNullFields from "@/util/filterNullFields";

const collectionName = 'users';

async function getUsers() {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const users = await collection.find({}, { projection: { _id: 0, auth: 0, email: 0, createdAt: 0 } }).toArray();

        console.log('Users:', users);
        return users; // Returns an array of user documents
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error('Error getting all users');
    } finally {
        await closeDB();
    }
}

async function getUserById(id: string) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ _id: new ObjectId(id) });

        return user; // Returns the user document if found, or null if not        
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw new Error('Error getting user by ID');
    } finally {
        await closeDB();
    }
};

async function deleteUserById(id: string) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) });

        console.log('Deleted:', result);
        return result; // Returns a DeleteResult object
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    } finally {
        await closeDB();
    }
};

async function updateUserById(id: string, data: { username?: string, name?: string, profilePic?: string }) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);

        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: filteredData && { updatedAt: new Date() } }
        );

        return result; // Returns an UpdateResult object
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    }
};

export { getUsers, getUserById, deleteUserById, updateUserById };