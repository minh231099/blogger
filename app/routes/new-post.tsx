import { CustomElement, PlateEditor } from "~/components/editor.client";
import { ClientOnly } from "remix-utils/client-only";
import { useState } from "react";
import { ActionFunction, json, MetaFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "~/utils/auth";
import { parse } from 'cookie';

export const meta: MetaFunction = () => {
    return [
        { title: "Writting a new blog ..." },
        { name: "description", content: "" },
    ];
};

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request }) => {
    const data = await request.json();
    const { title, content } = data;

    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const token = cookies['auth-token'];
    if (token) {
        try {
            const base64Decoded = Buffer.from(token, 'base64').toString('utf8').replace(/^"|"$/g, '');
            const decoded = verifyToken(base64Decoded) as { userId: number };
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

            if (user) {
                if (typeof title !== "string" || typeof content !== "string") {
                    return json({ error: "Invalid form submission" }, { status: 400 });
                }

                await prisma.post.create({
                    data: {
                        title,
                        content,
                        authorId: decoded.userId,
                    },
                });

                return redirect("/");
            }
        } catch (error) {
            return json({ error: 'Invalid User' }, { status: 400 });
        }
    }

    return json({ error: 'Post Blog Failed!' }, { status: 500 });
};

const NewPostPage = () => {
    const actionData = useActionData<typeof action>();
    const [editorContent, setEditorContent] = useState<CustomElement[]>([
        {
            id: '1',
            type: 'p',
            children: [{ text: 'Writting Something Cool' }],
        },
    ]);
    const [title, setTitle] = useState("");

    const onChangeEditor = (value: any) => {
        setEditorContent(value);
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("/new-post", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content: JSON.stringify(editorContent) }),
        });

        if (response.ok) {
            window.location.href = "/";
        } else {
            console.error("Failed to submit form");
        }
    };

    return (
        <div className="flex-grow container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-5">Writting A New Blog</h1>
            <Form onSubmit={handleSubmit}>
                <label>
                    <h2 className="text-2xl font-bold my-5">Title</h2>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="border rounded p-2 w-full mb-4"
                        placeholder="Enter the title of your post"
                    />
                </label>
                <h2 className="text-2xl font-bold my-5">Content</h2>
                <ClientOnly fallback={<p>Loading...</p>}>
                    {() => (
                        <PlateEditor
                            onChangeFn={onChangeEditor}
                        />
                    )}
                </ClientOnly>
                {actionData?.error ? <p>{actionData?.error}</p> : null}
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md mt-4"
                >
                    Post
                </button>
            </Form>
        </div>
    )
}

export default NewPostPage;