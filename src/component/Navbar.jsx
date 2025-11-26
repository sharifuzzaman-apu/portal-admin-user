import React from "react";
import { NavLink } from "react-router-dom";

// Layout component that renders the shared navigation shell.
const Navbar = ({ children, items = [] }) => {
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="app-sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 shadow">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="app-sidebar"
              className="btn btn-ghost btn-square"
              aria-label="toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 text-xl font-semibold">Portal</div>
        </div>
        <main className="flex-1 overflow-y-auto bg-base-200 p-6">{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="app-sidebar" className="drawer-overlay" aria-label="close sidebar"></label>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 gap-2 p-4">
          {items.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? "active font-semibold" : undefined
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
