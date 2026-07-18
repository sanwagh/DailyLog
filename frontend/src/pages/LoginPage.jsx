import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Banner from "../components/Banner.jsx";
import { getEntryRange, ApiError } from "../api.js";
import { setAuthHeader, isAuthenticated } from "../auth.js";
import { todayISODate } from "../dateUtils.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alreadyAuthed] = useState(() => isAuthenticated());

  if (alreadyAuthed) {
    return <Navigate to="/" replace />;
  }

  const redirectTo = location.state?.from?.pathname ?? "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setAuthHeader(username, password);
    try {
      const today = todayISODate();
      await getEntryRange(today, today);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Incorrect username or password.");
      } else if (err instanceof ApiError && err.status === null) {
        setError("Could not reach the server.");
      } else {
        setError("Something went wrong signing in.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page--login">
      <h1 className="login-head">Sign in</h1>

      {error && <Banner kind="error">{error}</Banner>}

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form__field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            disabled={submitting}
            required
          />
        </label>

        <label className="login-form__field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={submitting}
            required
          />
        </label>

        <div className="page__actions">
          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
