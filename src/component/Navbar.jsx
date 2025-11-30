import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.init.js";
import { logout } from "../pages/features/authSlice.js";

// Layout component that renders the shared navigation shell.
const Navbar = ({ children, items = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const displayName = user?.displayName || user?.email || "User";
  const avatarFallback = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Failed to sign out", error);
    }
    dispatch(logout());
    navigate("/login");
  };

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
          <div className="flex items-center gap-3 px-4">
            <span className="text-sm font-medium">{displayName}</span>
            {user?.photoURL ? (
              <div className="avatar">
                <div className="w-10 rounded-full border border-base-300">
                  <img src={user.photoURL} alt="User avatar" />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                  <span>{avatarFallback}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-base-200 p-6">{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="app-sidebar" className="drawer-overlay" aria-label="close sidebar"></label>
        <div className="flex min-h-full w-80 flex-col bg-base-100 p-4 text-base-content">
          <ul className="menu gap-2 flex-1">
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
          <button className="btn btn-outline btn-error mt-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
