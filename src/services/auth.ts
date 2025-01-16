import { WithId } from "mongodb";

import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";
import { UserSchema } from "@/types/user";

const collectionName = 'users';

// Get user by username or email
const getUser = async ({ username, email }: { username?: string, email?: string }): Promise<WithId<Document> | null> => {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ $or: [{ username }, { email }] }) as WithId<Document>;

        if (!user) return null;

        return user;
    } catch (error) {
        console.error('Error when searching for user:', error);
        throw new Error('Error when searching for user');
    } finally {
        await closeDB();
    }
}

const createUser = async (user: UserSchema) => {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(user);

        if (!result.acknowledged) throw new Error('Error creating user');

        return result; // Returns the user document
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        await closeDB();
    }
};


export { getUser, createUser };