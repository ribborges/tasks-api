import { secret } from '@/config/env';

import crypto from 'crypto';

const random = () => crypto.randomBytes(128).toString('base64');

const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(secret).digest('hex');
};

export { random, authentication };