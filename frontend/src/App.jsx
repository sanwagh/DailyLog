import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import EntriesPage from "./pages/EntriesPage.jsx";
import NewEntryPage from "./pages/NewEntryPage.jsx";
import GraphsPage from "./pages/GraphsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AUTH_INVALID_EVENT } from "./auth.js";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleAuthInvalid() {
      if (location.pathname === "/login") return;
      navigate("/login", { replace: true, state: { from: location } });
    }
    window.addEventListener(AUTH_INVALID_EVENT, handleAuthInvalid);
    return () => window.removeEventListener(AUTH_INVALID_EVENT, handleAuthInvalid);
  }, [navigate, location]);

  return (
    <div className="app">
      {location.pathname !== "/login" && <TopBar />}
      <main className="app__main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <EntriesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/new"
            element={
              <RequireAuth>
                <NewEntryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/graphs"
            element={
              <RequireAuth>
                <GraphsPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
