import app from '@/server';
import { appPort } from "@/config/env";
import { connectDB } from "@/database/operations";
import { gracefulShutdown, trackConnections } from "@/util/shutdownHandler";

const port = appPort || 8000;

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});

// Track connections for graceful shutdown
trackConnections(server);

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown('SIGTERM', server));
process.on('SIGINT', gracefulShutdown('SIGINT', server));
process.on('uncaughtException', gracefulShutdown('uncaughtException', server));