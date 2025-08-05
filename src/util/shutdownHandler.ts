import type { Socket } from "net";
import type { Server } from "http";

import { closeDB } from "@/database/operations";
import { setIsShuttingDown } from "@/middleware/gracefulShutdown";
import { ShutdownSignal } from "@/types/ShutdownSignal";

const connections = new Set<Socket>();

// Track connections
function trackConnections(server: Server): void {
    server.on('connection', (connection: Socket) => {
        connections.add(connection);
        connection.on('close', () => {
            connections.delete(connection);
        });
    });
}

// Graceful shutdown function
function gracefulShutdown(signal: ShutdownSignal, server: Server) {
    return (err: Error) => {
        console.log(`${signal}: Starting graceful shutdown...`);

        // Prevent new requests
        setIsShuttingDown(true);

        // Close server to new connections
        server.close(async (serverErr) => {
            if (serverErr) {
                console.error('Error during server close:', serverErr);
                process.exit(1);
            }

            console.log('Server closed, terminating remaining connections...');

            // Close all active connections
            for (const connection of connections) {
                console.log(`Closing connection: ${connection.remoteAddress}:${connection.remotePort}`);
                connection.destroy();
            }

            // Close database connections
            await closeDB();

            console.log('Graceful shutdown complete');
            process.exit(err ? 1 : 0);
        });

        // Force shutdown after timeout (e.g., 10 seconds)
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000).unref(); // unref prevents the timer from keeping the process alive
    };
}

export { trackConnections, gracefulShutdown };