import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";

const navItems = [
    { to: "/user", label: "Home" },
    { to: "/user/tasks", label: "Tasks" },
    { to: "/user/notifications", label: "Notifications" },
];

const User = () => {
    return (
        <Navbar items={navItems}>
            <Outlet />
        </Navbar>
    );
};

export default User;