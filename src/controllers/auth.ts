import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { UserSchema } from '@/types/user';
import { createUser, getUser } from '@/services/auth';
import { hashPassword, genToken, random } from '@/helpers/auth';

async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Missing required fields');
        return;
    }

    const user = await getUser({ username }) as ({ _id: ObjectId } & UserSchema) | null;

    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    if (!user?.auth.salt) {
        res.status(400).send('Invalid user data');
        return;
    }

    const expectedHash = hashPassword(user.auth.salt, password);

    if (expectedHash !== user.auth.password) {
        res.status(401).send('Invalid password');
        return;
    }

    const token = genToken(user.auth.salt);

    res.cookie('token', token, {
        path: '/',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: true,
        secure: true
    });

    res.status(201).json({
        user: user.username,
        name: user.name,
        email: user.email,
        token
    });

    return;
}

async function register(req: Request, res: Response) {
    try {
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
            res.status(400).send('Missing required fields');
            return;
        }

        if (password.length < 8) {
            res.status(400).send('Password must be at least 8 characters long');
            return;
        }

        if (await getUser({ username, email })) {
            res.status(400).send('User already exists');
            return;
        }

        const salt = random();

        const user = await createUser({
            username,
            name,
            email,
            auth: {
                password: hashPassword(salt, password),
                salt: salt
            },
            createdAt: new Date()
        });

        const token = genToken(salt);

        res.cookie('token', token, {
            path: '/',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true
        });

        res.status(201).json({
            user: user.username,
            name: user.name,
            email: user.email,
            token
        });

        return;
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
}

export { login, register };