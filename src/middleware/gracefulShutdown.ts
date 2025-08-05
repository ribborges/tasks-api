import { Request, Response, NextFunction } from 'express';

let isShuttingDown = false;

function gracefulShutdownMiddleware(req: Request, res: Response, next: NextFunction) {
    if (isShuttingDown) {
        res.set('Connection', 'close');
        res.status(503).send('Server is shutting down, please try again later');
        return;
    }

    next();
};

function setIsShuttingDown(value: boolean) {
    isShuttingDown = value;
};

export {
    gracefulShutdownMiddleware,
    setIsShuttingDown
};