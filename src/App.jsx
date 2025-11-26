import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";

import Admin from './pages/admin.jsx';
import User from './pages/user.jsx';
import AdminHome from './component/admin/AdminHome.jsx';
import AdminUsers from './component/admin/AdminUsers.jsx';
import AdminTasks from './component/admin/AdminTasks.jsx';
import UserHome from './component/user/UserHome.jsx';
import UserTasks from './component/user/UserTasks.jsx';
import Login from './pages/Loginauth.jsx';
import SignUp from './pages/SignUpauth.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tasks" element={<AdminTasks />} />
      </Route>
      <Route path="/user" element={<User />}>
        <Route index element={<UserHome />} />
        <Route path="tasks" element={<UserTasks />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
