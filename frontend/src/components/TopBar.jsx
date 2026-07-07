import { NavLink } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="top-bar">
      <nav className="top-bar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `top-bar__link${isActive ? " top-bar__link--active" : ""}`}
        >
          Entries
        </NavLink>
        <NavLink
          to="/graphs"
          className={({ isActive }) => `top-bar__link${isActive ? " top-bar__link--active" : ""}`}
        >
          Graphs
        </NavLink>
      </nav>
    </header>
  );
}
