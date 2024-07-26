import { LoaderFunction, ActionFunction, json, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useParams, Link } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { PrismaClient } from "@prisma/client";
import { useState, useEffect } from "react";
import { parse } from 'cookie';
import { verifyToken } from "~/utils/auth";
import { CustomElement, PlateEditor } from "~/components/editor.client";

const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
    return [
        { title: "Editing blog ..." },
        { name: "description", content: "" },
    ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const { id } = params;
    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const token = cookies['auth-token'];

    if (token) {
        try {
            const base64Decoded = Buffer.from(token, 'base64').toString('utf8').replace(/^"|"$/g, '');
            const decoded = verifyToken(base64Decoded) as { userId: number };
            const post = await prisma.post.findUnique({ where: { id: Number(id) } });

            if (post?.authorId === decoded.userId) {
                return json({ post });
            } else {
                return redirect("/");
            }
        } catch (error) {
            return redirect("/login");
        }
    } else {
        return redirect("/login");
    }
};

export const action: ActionFunction = async ({ request, params }) => {
    const { id } = params;
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

                await prisma.post.update({
                    where: { id: Number(id) },
                    data: {
                        title,
                        content,
                    },
                });

                return redirect(`/blog/${title.replace(/\s+/g, '-')}-${id}`);
            }
        } catch (error) {
            return json({ error: 'Invalid User' }, { status: 400 });
        }
    }

    return json({ error: 'Update Blog Failed!' }, { status: 500 });
};

const EditPostPage = () => {
    const { post } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [editorContent, setEditorContent] = useState<CustomElement[]>(JSON.parse(post.content));
    const [title, setTitle] = useState(post.title);

    const onChangeEditor = (value: any) => {
        setEditorContent(value);
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch(window.location.pathname, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content: JSON.stringify(editorContent) }),
        });

        if (response.ok) {
            window.location.href = `/profile`;
        } else {
            console.error("Failed to submit form");
        }
    };

    return (
        <div className="flex-grow container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-5">Editing Blog</h1>
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
                            initialValueForm={editorContent}
                            onChangeFn={onChangeEditor}
                        />
                    )}
                </ClientOnly>
                {actionData?.error ? <p>{actionData?.error}</p> : null}
                <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md mt-4"
                >
                    Update
                </button>
                <Link
                    className="bg-primary text-white px-4 py-2.5 rounded-md mt-4 ml-2"
                    to="/profile"
                >
                    Cancel
                </Link>
            </Form>
        </div>
    )
}

export default EditPostPage;
