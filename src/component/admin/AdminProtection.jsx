import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtection = ({ children }) => {
	const user = useSelector((state) => state.auth.user);

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	if (!user.isAdmin) {
		return <Navigate to="/user" replace />;
	}

	return children;
};

export default AdminProtection;
