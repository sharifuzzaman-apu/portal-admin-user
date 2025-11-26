import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

const navItems = [
    { to: "/admin", label: "Home" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/tasks", label: "Tasks" },
];

const Admin = () => {
    return (
        <Navbar items={navItems}>
            <Outlet />
        </Navbar>
    );
};

export default Admin;