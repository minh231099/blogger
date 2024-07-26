import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { parse } from 'cookie';
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "~/utils/auth";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request, params }) => {
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
            console.error(error);
            return redirect("/login");
        }
    }

    return redirect("/login");
};


export default function DeletePost() {
    return (
      <div>
        <h1>Deleting...</h1>
      </div>
    );
  }