import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useClientTheme,
  useTheme,
} from "remix-themes";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { unsafeCookie } from "./cookie";
import { themeSessionResolver } from "./sessions.server";
import { ThemeSwitcher } from "./components/theme-switcher";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

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
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Links />
      </head>
      <body>
        <ThemeSwitcher />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
