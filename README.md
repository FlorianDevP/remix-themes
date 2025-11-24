# Remix Themes

### An abstraction for themes in your [React router](https://reactrouter.com/) / [Remix](https://remix.run/) app.

## Features

- ✅ Perfect dark mode in a few lines of code
- ✅ System setting with prefers-color-scheme
- ✅ No flash on load
- ✅ Disable flashing when changing themes
- ✅ Class or data attribute selector
- ✅ Sync theme across tabs and windows

Check out the
[Example](https://github.com/abereghici/remix-themes/tree/main/test-apps/react-router-app)
to see it in action.

If you are using Remix.run you can use v1.6.1 of this library or lower, v2 onwards is only react-router v7 compatible.

## Install

```bash
$ npm install remix-themes
# or
$ yarn add remix-themes
```

## Getting Started

### Create your unsecured cookie, session storage and create a themeSessionResolver

```ts
// cookie.ts

import { createCookie } from "react-router";

export const unsafeCookie = createCookie("__remix-themes", {
  // domain: 'remix.run',
  path: "/",
  sameSite: "lax",
  secrets: ["s3cr3t"],
  // can't be httpOnly or secure
});
```

```ts
// sessions.server.tsx

import { createCookieSessionStorage } from "react-router";
import { createThemeSessionResolver } from "remix-themes";
import { unsafeCookie } from "./cookie";

export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: unsafeCookie,
  }),
);
```

Note: make sure you have the `domain` parameter set only for your
production environment. Otherwise, Safari won't store the cookie if you set
this parameter on localhost.

### Setup Remix Themes

```ts
// root.tsx

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import {
  ThemeProvider,
  useTheme,
  PreventFlashOnWrongTheme,
} from "remix-themes";
import { unsafeCookie } from "./cookie";
import { themeSessionResolver } from "./sessions.server";

// Return the theme from the session storage using the loader
export const loader: LoaderFunction = async ({ request }) => {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
};

// Use the theme in your Layout.
// If the theme is missing in session storage, PreventFlashOnWrongTheme will get
// the browser theme before hydration and will prevent a flash in browser.
// The client code runs conditionally, it won't be rendered if we have a theme in session storage.
function LayoutWithoutProvider({
  children,
  ssrTheme,
}: {
  children: React.ReactNode;
  ssrTheme: boolean;
}) {
  const [theme] = useTheme();

  return (
    <html lang="en" data-theme={theme ?? ""} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <PreventFlashOnWrongTheme
          ssrTheme={ssrTheme}
          cookieName={unsafeCookie.name}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Wrap your Layout with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const theme = useClientTheme(unsafeCookie.name, data?.theme);

  return (
    <ThemeProvider
      specifiedTheme={theme}
      themeAction="/action/set-theme"
      disableTransitionOnThemeChange={true}
    >
      <LayoutWithoutProvider ssrTheme={Boolean(data?.theme)}>
        {children}
      </LayoutWithoutProvider>
    </ThemeProvider>
  );
}
```

#### Add the action route

Create a file in `/routes/action/set-theme.ts` or `/routes/action.set-theme.ts`
when using
[Route File Naming v2](https://remix.run/docs/en/1.19.3/file-conventions/route-files-v2#route-file-naming-v2)
with the content below. Ensure that you pass the filename to the `ThemeProvider`
component.

> Note: You can name the action route whatever you want. Just make sure you pass
> the correct action name to the `ThemeProvider` component. Make sure to use
> absolute path when using nested routing.

This route is used to store the preferred theme in the session storage when
the user changes it.

```ts
import { createThemeAction } from "remix-themes";
import { themeSessionResolver } from "./sessions.server";

export const action = createThemeAction(themeSessionResolver);
```

## API

Let's dig into the details.

### ThemeProvider

- `specifiedTheme`: The theme from the session storage.
- `themeAction`: The action name used to change the theme in the session
  storage.
- `disableTransitionOnThemeChange`: Disable CSS transitions on theme change to
  prevent the flashing effect.

### useTheme

useTheme takes no parameters but returns:

- `theme`: Active theme name
- `setTheme`: Function to set the theme. If the theme is set to `null`, the
  system theme will be used and `definedBy` property in the `metadata` object
  will be set to `SYSTEM`.
- `metadata`: An object which contains the following properties:
  - `definedBy`: The theme source. It can be `USER` or `SYSTEM`. Useful to
    detect if the theme was set by the user or by the system.

### useClientTheme

Gets the theme on the client from the cookie if it was not available on the server.

- `cookieName`: Name of the cookie used store the theme.
- `data`: Theme value you get from your loader.
  Undefined if the loader failed to get the theme or was not called.

### createThemeSessionResolver

`createThemeSessionResolver` function takes a cookie session storage and returns

- `resolver`: A function that takes a request and returns an object with the
  following properties:
  - `getTheme`: A function that returns the theme from the session storage.
  - `setTheme`: A function that takes a theme name and sets it in the session
    storage.
  - `commit`: A function that commits the session storage (Stores all data in
    the session and returns the Set-Cookie header to use in the HTTP response.)

### PreventFlashOnWrongTheme

On the server, "theme" might be `null` so `PreventFlashOnWrongTheme` ensures
that this is correct before hydration. If the theme is null on the server, this
component will set the browser theme on the `html` element in a `data-theme`
attribute if exists, otherwise it will be set to a `class` attribute. If both
`data-theme` and `class` are set, the `data-theme` will be used.

- `ssrTheme`: boolean value that indicates if we have a theme in the session
  storage.
