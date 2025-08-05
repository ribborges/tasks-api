import { appPort } from "@/config/env";
import { connectDB } from "@/database/operations";
import app from './server';

const port = appPort || 8000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});