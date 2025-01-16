import { Request, Response } from 'express';

import { createUser, getUser } from '@/services/auth';
import { authentication, random } from '@/helpers/auth';

async function register(req: Request, res: Response) {
    try {
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) res.status(400).send('Missing required fields');
        else if (password.length < 8) res.status(400).send('Password must be at least 8 characters long');
        else if (await getUser({ username, email })) res.status(409).send('User already exists');
        else {
            const salt = random();

            const user = await createUser({
                username,
                name,
                email,
                auth: {
                    password: authentication(salt, password),
                    salt
                },
                createdAt: new Date()
            });

            res.status(201).json(user);
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
}

export { register };