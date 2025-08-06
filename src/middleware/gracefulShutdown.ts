import { Request, Response, NextFunction } from 'express';

let isShuttingDown = false;

// Middleware to handle graceful shutdown state in requests
function gracefulShutdownMiddleware(req: Request, res: Response, next: NextFunction) {
    if (isShuttingDown) {
        res.set('Connection', 'close');
        res.status(503).send('Server is shutting down, please try again later');
        return;
    }

    next();
};

// Function to update the shutdown state
function setIsShuttingDown(value: boolean) {
    isShuttingDown = value;
};

export {
    gracefulShutdownMiddleware,
    setIsShuttingDown
};