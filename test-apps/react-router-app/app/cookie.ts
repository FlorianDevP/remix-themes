import { createCookie } from "react-router";

export const unsafeCookie = createCookie("__remix-themes", {
  // domain: 'remix.run',
  path: "/",
  sameSite: "lax",
  secrets: ["s3cr3t"],
});
