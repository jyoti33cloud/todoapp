import { useState } from "react";
import { api, auth } from "./api";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const fn = mode === "login" ? api.login : api.register;
      const { token, username: u } = await fn(username.trim(), password);
      auth.set(token, u);
      onAuth();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <header>
          <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
        </header>

        {error && (
          <div className="error">
            ⚠ {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="input-row">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              required
            />
          </div>
          <div className="input-row">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password (min 8 chars)"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={8}
              required
            />
          </div>
          <div className="input-row">
            <button type="submit" disabled={busy} style={{ flex: 1 }}>
              {busy ? "..." : mode === "login" ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <p className="empty" style={{ padding: "0.5rem 0" }}>
          {mode === "login" ? "No account? " : "Have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6ee7b7",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
