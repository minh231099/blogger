import jwt from 'jsonwebtoken';
import { createCookie } from '@remix-run/node';

const SECRET_KEY = process.env.SECRET_KEY as string;;

export function generateToken(userId: number) {
    return jwt.sign({ userId }, SECRET_KEY);
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET_KEY);
}

export const authCookie = createCookie('auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
});