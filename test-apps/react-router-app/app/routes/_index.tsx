import { useEffect } from "react";
import { Theme, useTheme } from "remix-themes";

export default function Index() {
  const [theme, setTheme, { definedBy }] = useTheme();

  useEffect(() => {
    console.log({ theme, definedBy });
  }, [definedBy, theme]);

  return (
    <div>
      <h1>Welcome to React Router</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <a href="/about">About</a>
        <a href="/broken-route">Broken Route</a>
      </div>
    </div>
  );
}
