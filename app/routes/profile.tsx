import { Post, PrismaClient } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { parse } from 'cookie';
import { Fragment } from "react/jsx-runtime";
import UserProfileBlogCard from "~/components/UserProfileBlogCard";
import { verifyToken } from "~/utils/auth";

export const meta: MetaFunction = () => {
    return [
        { title: 'Profile' },
        { description: "User Profile" }
    ];
};

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request }) => {
    const cookieHeader = request.headers.get('Cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const token = cookies['auth-token'];
    if (token) {
        try {
            const base64Decoded = Buffer.from(token, 'base64').toString('utf8').replace(/^"|"$/g, '');
            const decoded = verifyToken(base64Decoded) as { userId: number };
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    posts: true,
                },
            });

            return json({ user });

        } catch (error) {
            return redirect("/login");
        }
    }
};

const countAllViewsOfUser = (posts: Post[]) => {
    const sumWithInitial = posts.reduce(
        (accumulator: number, currentValue: Post) => accumulator + currentValue.viewed,
        0,
    );
    return sumWithInitial;
}

const ProfilePage = () => {
    const { user } = useLoaderData<typeof loader>();
    const views = countAllViewsOfUser(user.posts);

    return (
        <div className="flex flex-col lg:flex-row max-w-7xl lg:mx-auto my-5">
            <div className="mx-5 lg:w-1/6 border p-5 h-fit mb-4 lg:mb-0">
                <p>{user.name}</p>
                <hr className="border-t-2 border-gray-300 my-4" />
                <p>{views} {views > 1 ? 'views' : 'view'}</p>
            </div>
            <div className="mx-5 lg:w-5/6 lg:ml-10">
                <div>
                    <p className="font-bold">Blogs</p>
                    <div className="grid grid-cols-1">
                        {user.posts.map((post: Post) => (
                            <Fragment key={post.id}>
                                <UserProfileBlogCard post={post} />
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <Link to='/logout' className="lg:hidden block bg-black text-white mt-5 mx-5 py-2 text-center">
                Logout
            </Link>
        </div>
    )
}

export default ProfilePage;