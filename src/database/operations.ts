import client from "./client";

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function setupDatabase() {
    try {
        // Connect to the MongoDB database
        const database = client.db('task-manager');

        // Create a collection if it doesn't exist
        await database.createCollection('tasks');
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

export { connectDB, setupDatabase, insertMockData };