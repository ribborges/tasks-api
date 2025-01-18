import { WithId, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";
import { UserSchema } from "@/types/user";
import { secret } from "@/config/env";

const collectionName = 'users';

// Get user by username or email
async function getUser ({ username, email }: { username?: string, email?: string }): Promise<WithId<Document> | null> {
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

async function createUser (user: UserSchema) {
    try {
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(user);

        if (!result.acknowledged) throw new Error('Error creating user');

        return {
            _id: result.insertedId,
            ...user
        }; // Returns the user document
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        await closeDB();
    }
};

async function getUserByToken (token: string) {
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        const userId = ObjectId.createFromHexString(decoded.id);
        
        await connectDB();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ _id: userId }, { projection: { auth: 0 } }) as WithId<Document>;

        if (!user) return null;

        return user;
    } catch (error) {
        console.error('Error when searching for user by token:', error);
        throw new Error('Error when searching for user by token');
    } finally {
        await closeDB();
    }
}

export { getUser, createUser, getUserByToken };