import { LoaderFunction, redirect } from "@remix-run/node";
import { authCookie, } from '../utils/auth';

export let loader: LoaderFunction = async ({ request }) => {
  let cookieHeader = request.headers.get("Cookie");
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", { maxAge: 0 }),
    },
  });
};

export default function Logout() {
  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}