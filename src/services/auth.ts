import { WithId, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { merge } from 'lodash-es';

import client from "@/database/client";
import { dbName } from "@/database/operations";
import { UserSchema } from "@/types/user";
import { secret } from "@/config/env";
import filterNullFields from "@/util/filterNullFields";

const collectionName = 'users';

async function findUserByAuth({ username, email }: { username?: string, email?: string }) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ $or: [{ username }, { email }] }) as WithId<Document>;

        if (!user) return null;

        return user;
    } catch (error) {
        console.error('Error when searching for user:', error);
        throw new Error('Error when searching for user');
    }
}

async function getUserByToken(token: string) {
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        const userId = ObjectId.createFromHexString(decoded.id);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ _id: userId }) as WithId<Document>;

        if (!user) return null;

        return user;
    } catch (error) {
        console.error('Error when searching for user by token:', error);
        throw new Error('Error when searching for user by token');
    }
}

async function insertUser(data: UserSchema) {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filteredData = filterNullFields(data);

        merge(filteredData, { createdAt: new Date() });

        const result = await collection.insertOne(filteredData);

        if (!result.acknowledged) throw new Error('Error creating user');

        return {
            _id: result.insertedId,
            ...data
        }; // Returns the user document
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
};

export { findUserByAuth, getUserByToken, insertUser };