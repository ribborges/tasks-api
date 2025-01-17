import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { secret } from '@/config/env';

const random = () => crypto.randomBytes(128).toString('base64');

const genToken = (salt: string) => {
    return jwt.sign({ salt }, secret, {
        expiresIn: "30d",
    });
};

const hashPassword = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(secret).digest('hex');
};

export { random, hashPassword, genToken };