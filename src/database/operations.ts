import client from "./client";

const dbName = 'task-manager';

// Connect to the MongoDB database
async function connectDB() {
    await client.connect()
        .then(() => {
            console.log('Connected to MongoDB');
        }).catch((error) => {
            console.error('Error connecting to MongoDB:', error);
        });
}

// Close the MongoDB connection
async function closeDB() {
    await client.close()
        .then(() => {
            console.log('Closed MongoDB connection');
        }).catch((error) => {
            console.error('Error closing MongoDB connection:', error);
        });
}

export { dbName, connectDB, closeDB };