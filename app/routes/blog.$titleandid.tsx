import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";

import { PrismaClient } from '@prisma/client';
import PostContent from "~/components/PostContent";

type Post = {
    id: number;
    title: string;
    content?: string;
    published: boolean;
    author: {
        id: number;
        name: string;
    };
};

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ params }) => {
    const { titleandid } = params;

    if (!titleandid) {
        throw new Response("Post not found", { status: 404 });
    }
    else {
        const postId = titleandid.split('-').pop();
        try {
            const post = await prisma.post.findUnique({
                where: { id: Number(postId) },
                include: {
                    author: true,
                },
            });

            if (!post) {
                throw new Response("Post not found", { status: 404 });
            }

            return json(post);
        } catch (error) {
            return json({ error: "Failed to fetch post" }, { status: 500 });
        }
    }
};

export const meta: MetaFunction<typeof loader> = ({ data }: { data?: Post }) => {
    if (!data) {
        return [{
            title: "Post not found"
        },
        {
            description: "This post does not exist or has been removed."
        }];
    }

    return [
        { title: data.title },
        { description: "A blog post" }
    ];
};


const PostPage = () => {
    const post = useLoaderData<Post>();

    return (
        <div className="flex-grow container mx-auto p-4">
            <div>
                {
                    post ?
                        <Fragment>
                            <section className="my-10">
                                <h1 className="text-4xl font-bold text-justify montserrat text-gray-600 tracking-widest">{post.title}</h1>
                                <b>Author: {post.author.name}</b>
                            </section>
                            <PostContent content={post.content!} />
                        </Fragment>
                        :
                        <>I don't  find this blog</>
                }
            </div>
        </div>
    )
}

export default PostPage;