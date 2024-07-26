import { type MetaFunction } from "@remix-run/node";
import { json, type LoaderFunction } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';
import { Link, useLoaderData } from "@remix-run/react";
import BlogCard, { Post } from "~/components/BlogCard";
import { Fragment } from "react/jsx-runtime";
import TopViewBlogCard from "~/components/TopViewBlogCard";
import TopUsersTable from "~/components/TopUser";
import Pagination from "~/components/Pagination";

const prisma = new PrismaClient();

export const meta: MetaFunction = () => {
  return [
    { title: "Homepage" },
    { name: "description", content: "Welcome to Homepage!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = 5;

  const searchQuery = url.searchParams.get('search') || '';

  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: searchQuery,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalPosts = await prisma.post.count({
    where: {
      title: {
        contains: searchQuery,
      },
    },
  });

  const topViewedPosts = await prisma.post.findMany({
    orderBy: {
      viewed: 'desc',
    },
    take: 4,
    include: {
      author: true,
    },
  });

  const topUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    include: {
      posts: true,
    },
  });

  return json({
    posts,
    totalPosts,
    page,
    limit,
    topViewedPosts,
    topUsers,
  });
};

export default function Index() {
  const { posts, totalPosts, page, limit, topViewedPosts, topUsers } = useLoaderData<typeof loader>();

  const changePage = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.location.href = url.toString();
  }

  return (
    <div className="">
      <div className="">
        <div className="bg-gray-200 pt-5 pb-2">
          <div className="max-w-7xl lg:mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Highlight Article</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {
                topViewedPosts.map((post: Post) => (
                  <Fragment key={post.id}>
                    <TopViewBlogCard post={post} />
                  </Fragment>
                ))
              }
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex justify-between items-center my-4">
          <h3 className="text-2xl font-bold">For You</h3>
        </div>
        <div className="max-w-7xl mx-auto flex justify-between">
          <div className="w-full lg:w-4/5">
            <div className="grid grid-cols-1">
              {posts.map((post: Post) => (
                <Fragment key={post.id}>
                  <BlogCard post={post} />
                </Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-8 mx-auto">
              <Pagination
                totalData={totalPosts} current={page} limit={limit}
                onChangePage={changePage}
              />
            </div>
          </div>
          <div className="my-2 w-1/5 ml-5 hidden lg:block">
            <TopUsersTable users={topUsers} />
          </div>
        </div>
      </div>

    </div>
  );
}
