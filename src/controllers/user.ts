import { Request, Response } from 'express';
import { get } from 'lodash';

import { getUsers, getUserById, deleteUserById, updateUserById, updatePasswordById } from '@/services/user';
import { hashPassword, random } from '@/helpers/auth';

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
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).send('Error getting all users');
    }
};

async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteUserById(id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { username, name, profilePic } = req.body;

        const user = await getUserById(id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        await updateUserById(id, {
            username,
            name,
            profilePic
        });

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
}

async function updatePassword(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const user = await getUserById(id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        if (!password || !id) {
            res.status(400).send('Missing required fields');
            return;
        }

        if (password.length < 8) {
            res.status(400).send('Password must be at least 8 characters long');
            return;
        }

        const salt = random();

        await updatePasswordById(id, { salt, password: hashPassword(salt, password) });

        res.status(200).send('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Error updating password');
    }
}

export { getLogguedUser, getAllUsers, deleteUser, updateUser, updatePassword };