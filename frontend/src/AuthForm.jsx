import { useState } from "react";
import "./AuthForm.css";
import { api, auth } from "./api";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const fn = isLogin ? api.login : api.register;
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
    <div className="auth">
      <aside className="auth-brand">
        <div className="brand-mark">
          <span className="brand-dot" />
          todo
        </div>

        <div className="brand-rings" aria-hidden="true">
          <span /><span /><span />
        </div>

        <div className="brand-foot">
          <p className="brand-tag">
            Less mess.<br />More done.
          </p>
          <p className="brand-meta">v1.0 · est. 2026</p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mode-switch" role="tablist">
            <span
              className="switch-pill"
              data-pos={isLogin ? "left" : "right"}
              aria-hidden="true"
            />
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? "active" : ""}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          <h1 className="auth-title">
            {isLogin ? "Welcome back" : "Make it yours"}
          </h1>
          <p className="auth-sub">
            {isLogin
              ? "Sign in to pick up where you left off."
              : "Create an account to start tracking."}
          </p>

          {error && (
            <div className="auth-error">
              <span>⚠</span>
              <span className="auth-error-msg">{error}</span>
              <button onClick={() => setError(null)} aria-label="Dismiss">
                ✕
              </button>
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            <div className="field">
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder=" "
              />
              <label htmlFor="auth-username">Username</label>
            </div>

            <div className="field">
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
                placeholder=" "
              />
              <label htmlFor="auth-password">Password</label>
              {!isLogin && (
                <span className="field-hint">min. 8 chars</span>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? (
                <span className="dots" aria-label="Loading">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <p className="auth-foot">
            By continuing, you agree to keep your todos honest.
          </p>
        </div>
      </main>
    </div>
  );
}
