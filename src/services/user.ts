import client from "@/database/client";
import { closeDB, connectDB, dbName } from "@/database/operations";

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

export { getUsers };