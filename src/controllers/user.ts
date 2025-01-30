import { Request, Response } from 'express';
import { get } from 'lodash';
import { ObjectId } from 'mongodb';

import { findAllUsers, findUser, deleteUser, updateUser, updatePassword } from '@/services/user';
import { hashPassword, random } from '@/helpers/auth';
import { UserSchema } from '@/types/user';
import { findUserByAuth } from '@/services/auth';

async function getLogguedUser(req: Request, res: Response) {
    try {
        const user = get(req, 'identity') as unknown as ({ id: ObjectId } & UserSchema) | null;

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: req.cookies['token']
        });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("Internal server error");
    }
}

async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await findAllUsers();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).send('Error getting all users');
    }
};

async function removeUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).send('Missing user ID');
            return;
        }

        const result = await deleteUser(ObjectId.createFromHexString(id));

        if (result.deletedCount === 0) {
            res.status(404).send('User not found');
            return;
        }

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
}

async function changeUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { username, name, email, profilePic } = req.body;

        if (!id) {
            res.status(400).send('Missing user ID');
            return;
        }

        if (username && await findUserByAuth({ username })) {
            res.status(400).send('Username already in use');
            return;
        }

        const user = await findUser(ObjectId.createFromHexString(id));

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        await updateUser(ObjectId.createFromHexString(id), {
            username,
            name,
            email,
            profilePic
        });

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
}

async function changePassword(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const user = await findUser(ObjectId.createFromHexString(id));

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

        await updatePassword(ObjectId.createFromHexString(id), { password: hashPassword(salt, password), salt });

        res.status(200).send('Password updated successfully');
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Error updating password');
    }
}

export { getLogguedUser, getAllUsers, removeUser, changeUser, changePassword };