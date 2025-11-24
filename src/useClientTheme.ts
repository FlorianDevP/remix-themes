import { useMemo } from "react";
import { getThemeCookie } from "./cookie-parser";
import type { Theme } from "./theme";

export function useClientTheme(cookieName: string, data?: Theme | null) {
  return useMemo(() => {
    if (data) return data;

    // get actual theme value in browser, if theme was not available during ssr
    if (typeof document !== "undefined") {
      // decode cookie and get theme value
      const theme = getThemeCookie(document.cookie, { name: cookieName });
      return theme ? theme : null;
    }

    return null;
  }, [data]);
}
