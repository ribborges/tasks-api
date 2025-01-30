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

async function setupDB() {
    try {
        // Connect to the MongoDB database
        const database = client.db(dbName);

        // Create a collection if it doesn't exist
        await database.createCollection('tasks');
        await database.createCollection('users');
        console.log('Tasks collection created');

        console.log('Database setup completed');
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

async function insertMockData() {
    try {
        // Connect to the MongoDB database
        const database = client.db('task-manager');
        const collection = database.collection('tasks');

        // Generate mock data for tasks
        const mockData = [
            { name: 'Complete project proposal', isCompleted: false },
            { name: 'Buy groceries', isCompleted: false },
            { name: 'Call mom', isCompleted: false },
            { name: 'Schedule dentist appointment', isCompleted: false },
            { name: 'Read chapter 5 of the book', isCompleted: true },
            { name: 'Pay electricity bill', isCompleted: false },
            { name: 'Attend yoga class', isCompleted: true },
            { name: 'Write blog post', isCompleted: false },
            { name: 'Clean the garage', isCompleted: false },
            { name: 'Finish coding assignment', isCompleted: false },
            { name: 'Buy milk', isCompleted: false },
            { name: 'Do homework', isCompleted: false },
            { name: 'Call Gabriel', isCompleted: false },
            { name: 'Buy Chang birthday present', isCompleted: false }
        ];

        // Insert mock data into the database
        const result = await collection.insertMany(mockData);
        console.log(`${result.insertedCount} mock tasks inserted into the database`);
    } catch (error) {
        console.error('Error inserting mock data:', error);
    }
}

export { dbName, connectDB, closeDB, setupDB, insertMockData };