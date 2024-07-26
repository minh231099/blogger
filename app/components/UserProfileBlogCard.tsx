import { Link, useFetcher } from "@remix-run/react";
import BlogCoverImage from '~/assets/image/blog-cover.jpeg';
import { ContentElm } from "./PostContent";
import { ActionFunction, redirect } from "@remix-run/node";
import { verifyToken } from "~/utils/auth";
import { PrismaClient } from "@prisma/client";
import { parse } from 'cookie';

const prisma = new PrismaClient();

export type Post = {
    id: number;
    title: string;
    viewed: number;
    content: string | null;
};

export const action: ActionFunction = async ({ request, params }) => {
    const { id } = params;
    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const token = cookies['auth-token'];

    if (token) {
        try {
            const base64Decoded = Buffer.from(token, 'base64').toString('utf8').replace(/^"|"$/g, '');
            const decoded = verifyToken(base64Decoded) as { userId: number };

            const post = await prisma.post.findUnique({
                where: { id: Number(id) }
            });

            if (post?.authorId === decoded.userId) {
                await prisma.post.delete({
                    where: { id: Number(id) }
                });
                return redirect("/profile");
            } else {
                return redirect("/");
            }
        } catch (error) {
            return redirect("/login");
        }
    }

    return redirect("/login");
};


type UserProfileBlogCardProps = {
    post: Post;
};

const getNearestPTag = (content: ContentElm[]) => {
    return content.find((item) => item.type === 'p');
};

const getNearestImageURL = (content: ContentElm[]) => {
    const image = content.find((item) => item.type === 'img');
    return image?.url;
};

const countValueInContent = (content: ContentElm[]) => {
    let cnt = 0;
    content.forEach((value) => {
        if (value.type === 'p') {
            value.children.forEach((valueC) => {
                cnt += valueC.text.split(' ').length;
            });
        }
    });
    return Math.floor(cnt / 200);
};

const UserProfileBlogCard = (props: UserProfileBlogCardProps) => {
    const { post } = props;
    const content = post.content ? JSON.parse(post.content) : [];
    const coverUrl = getNearestImageURL(content);
    return (
        <div className="my-2">
            <Link to={`/edit-post/${post.id}`}>
                <div className="flex flex-col sm:flex-row w-full border p-4 rounded-sm hover:shadow-lg transition-shadow duration-300">
                    <img
                        className="w-full sm:w-48 h-48 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4"
                        src={coverUrl ? coverUrl : BlogCoverImage}
                        alt="Blog Cover"
                    />
                    <div className="flex flex-col justify-between w-full ml-3">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">about {countValueInContent(content)}m read</p>
                            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
                            <p className="text-gray-700 line-clamp-2 mb-4">
                                {getNearestPTag(content)?.children?.[0].text}
                            </p>
                        </div>
                        <Link to={`/delete-post/${post.id}`} className="bg-red-500 text-white w-24 rounded py-1 z-30 text-center">Delete</Link>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default UserProfileBlogCard;
