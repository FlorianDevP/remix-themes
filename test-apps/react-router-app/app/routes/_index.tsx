export default function Index() {
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
