import { Request, Response } from 'express';
import { get } from 'lodash';

import { getUsers, getUserById, deleteUserById, updateUserById } from '@/services/user';

async function getLogguedUser(req: Request, res: Response) {
    try {
        const user = get(req, 'identity');

        res.status(200).json(user);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("Internal server error");
    }
}

async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await getUsers();

        res.status(200).json(users);
        return;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error('Error getting all users');
    }
};

async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteUserById(id);
        res.status(200).json({ message: 'User deleted successfully' });
        return;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { username, name, profilePic } = req.body;

        const user = await getUserById(id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        await updateUserById(id, {
            username,
            name,
            profilePic
        });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    }
}

export { getLogguedUser, getAllUsers, deleteUser, updateUser };