import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useActionData, Form, redirect } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authCookie, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
    return json({});
};

export const action: ActionFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = generateToken(user.id);
        const cookieHeader = await authCookie.serialize(token);
        return redirect('/', {
            headers: {
                'Set-Cookie': cookieHeader,
            },
        });
    }

    return json({ error: 'Invalid email or password' }, { status: 400 });
};

export default function SignIn() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <Form method="post">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                {actionData?.error && (
                    <div className="text-red-500 text-sm mb-4">{actionData.error}</div>
                )}
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                    Sign In
                </button>
            </Form>
        </div>
    );
}
