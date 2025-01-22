import { ObjectId } from "mongodb";
import { merge } from "lodash";

import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";
import filterNullFields from "@/util/filterNullFields";
import { AuthSchema, UserSchema } from "@/types/user";

const collectionName = 'users';

async function findAllUsers() {
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

async function findUser(id: ObjectId) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ _id: id });

        return user; // Returns the user document if found, or null if not        
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw new Error('Error getting user by ID');
    } finally {
        await closeDB();
    }
};

async function deleteUser(id: ObjectId) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: id });

        console.log('Deleted:', result);
        return result; // Returns a DeleteResult object
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    } finally {
        await closeDB();
    }
};

async function updateUser(id: ObjectId, data: UserSchema) {
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

        return result; // Returns an UpdateResult object
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    } finally {
        await closeDB();
    }
};

async function updatePassword(id: ObjectId, auth: AuthSchema) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        merge(auth, { updatedAt: new Date() });

        const result = await collection.updateOne(
            { _id: id },
            { $set: auth }
        );

        return result; // Returns an UpdateResult object
    } catch (error) {
        console.error('Error updating password:', error);
        throw new Error('Error updating password');
    } finally {
        await closeDB();
    }
}

export { findAllUsers, findUser, deleteUser, updateUser, updatePassword };