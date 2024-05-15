import { Request, Response } from 'express';

const tasks = [
    { id: "60a0fd69e4909c0029fd7e63", name: 'Complete project proposal', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e64", name: 'Buy groceries', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e65", name: 'Call mom', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e66", name: 'Schedule dentist appointment', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e67", name: 'Read chapter 5 of the book', isCompleted: true },
    { id: "60a0fd69e4909c0029fd7e68", name: 'Pay electricity bill', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e69", name: 'Attend yoga class', isCompleted: true },
    { id: "60a0fd69e4909c0029fd7e6a", name: 'Write blog post', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e6b", name: 'Clean the garage', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e6c", name: 'Finish coding assignment', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e6d", name: 'Buy milk', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e6e", name: 'Do homework', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e6f", name: 'Call Gabriel', isCompleted: false },
    { id: "60a0fd69e4909c0029fd7e70", name: 'Buy Chang birthday present', isCompleted: false }
];

export const getTasks = async (req: Request, res: Response) => {
    try {
        res.status(200).send(tasks);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
}