import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

import { UserSchema } from '@/types/user';
import { createUser, getUser } from '@/services/auth';
import { hashPassword, genToken, random } from '@/helpers/auth';
import { secret } from '@/config/env';

async function login(req: Request, res: Response) {
    try {
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

        const token = genToken(user._id.toString());

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
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
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

        const token = genToken(user._id.toString());

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

async function logout(req: Request, res: Response) {
    try {
        res.clearCookie('token', {
            path: '/',
            httpOnly: true,
            sameSite: true,
            secure: true
        });

        res.status(200).send('Logged out successfully');

        return;
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).send('Error logging out user');
    }
}

async function status(req: Request, res: Response) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        if (!token || !decoded) {
            res.status(401).send(false);
            return;
        }

        res.status(200).send(true);
    } catch (error) {
        console.error('Error checking user status:', error);
        res.status(500).send('Error checking user status');
    }
}

export { login, register, logout, status };