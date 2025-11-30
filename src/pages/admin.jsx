import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

const navItems = [
    { to: "/admin", label: "Home" },
    { to: "/admin/assign", label: "Assign Task" },
    { to: "/admin/tasks", label: "Tasks" },
    { to: "/admin/users", label: "Users" },
];

const Admin = () => {
    return (
        <Navbar items={navItems}>
            <Outlet />
        </Navbar>
    );
};

export default Admin;