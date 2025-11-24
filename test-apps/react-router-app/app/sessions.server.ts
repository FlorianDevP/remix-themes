import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";
import { unsafeCookie } from "./cookie";

export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: unsafeCookie,
  }),
);
