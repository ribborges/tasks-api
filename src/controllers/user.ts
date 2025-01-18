import { Request, Response } from 'express';
import { get } from 'lodash';

import { getUsers } from '@/services/user';

async function getLogguedUser(req: Request, res: Response) {
    try {
        const user = get(req, 'identity');

        res.status(200).json(user);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("Internal server error");
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();

        res.status(200).json(users);
        return;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error('Error getting all users');
    }
};

export { getLogguedUser, getAllUsers };