// src/routes/signup.tsx
import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useActionData, Form, redirect } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
    return json({});
};

export const action: ActionFunction = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const email = formData.get('email');
    const name = formData.get('name');
    const password = formData.get('password');

    if (!email || !password) {
        return json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'user',
            },
        });
        return redirect('/signin');
    } catch (error) {
        return json({ error: 'User with this email already exists' }, { status: 400 });
    }
};

export default function SignUp() {
    const actionData = useActionData<typeof action>();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
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
                    Sign Up
                </button>
            </Form>
        </div>
    );
}
