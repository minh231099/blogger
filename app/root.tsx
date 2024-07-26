import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction } from "@remix-run/node";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import AppLayout from "~/components/Layout";
import { verifyToken } from '~/utils/auth';
import { Buffer } from 'buffer';
import { PrismaClient } from '@prisma/client';
import { parse } from 'cookie';
import { useLoaderData } from "@remix-run/react";
import "./tailwind.css";
import { Fragment } from "react/jsx-runtime";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies['auth-token'];

  if (token) {
    try {
      const base64Decoded = Buffer.from(token, 'base64').toString('utf8').replace(/^"|"$/g, '');

      const decoded = verifyToken(base64Decoded) as { userId: number };

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      return json({ user });
    } catch (error) {
      console.error('Token verification failed:', error);
      return json({ user: null });
    }
  }

  return json({ user: null });
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();

  const location = useLocation();

  const noLayoutPaths = ["/signin", "/signout"];

  const shouldUseLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {
          shouldUseLayout ?
            <AppLayout user={user}>
              {children}
            </AppLayout>
            : <Fragment>{children}</Fragment>
        }

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
