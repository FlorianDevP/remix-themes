import { Theme, useTheme } from "remix-themes";

export function ThemeSwitcher() {
  const [theme, setTheme, { definedBy }] = useTheme();

  return (
    <div style={{ margin: "1rem 0" }}>
      <label style={{ display: "flex", gap: "8px" }}>
        Theme
        <select
          name="theme"
          value={definedBy === "SYSTEM" ? "" : (theme ?? "")}
          onChange={(e) => {
            const nextTheme = e.target.value;

            if (nextTheme === "") {
              setTheme(null);
            } else {
              setTheme(nextTheme as Theme);
            }
          }}
        >
          <option value="">System</option>
          <option value={Theme.LIGHT}>Light</option>
          <option value={Theme.DARK}>Dark</option>
        </select>
      </label>
    </div>
  );
}
