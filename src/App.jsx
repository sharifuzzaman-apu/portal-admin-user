import React from 'react'
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";

import Admin from './pages/admin.jsx';
import User from './pages/user.jsx';
import AdminHome from './component/admin/AdminHome.jsx';
import AdminUsers from './component/admin/AdminUsers.jsx';
import AdminTasks from './component/admin/AdminTasks.jsx';
import AdminAssignTask from './component/admin/AdminAssignTask.jsx';
import AdminUserOverview from './component/admin/AdminUserOverview.jsx';
import UserHome from './component/user/UserHome.jsx';
import UserTasks from './component/user/UserTasks.jsx';
import UserNotifications from './component/user/UserNotifications.jsx';
import Login from './pages/Loginauth.jsx';
import SignUp from './pages/SignUpauth.jsx';
import AdminProtection from './component/admin/AdminProtection.jsx';
import RequireAuth from './component/RequireAuth.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/admin"
        element={(
          <AdminProtection>
            <Admin />
          </AdminProtection>
        )}
      >
        <Route index element={<AdminHome />} />
        <Route path="assign" element={<AdminAssignTask />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUserOverview />} />
        <Route path="tasks" element={<AdminTasks />} />
      </Route>
      <Route
        path="/user"
        element={(
          <RequireAuth>
            <User />
          </RequireAuth>
        )}
      >
        <Route index element={<UserHome />} />
        <Route path="tasks" element={<UserTasks />} />
        <Route path="notifications" element={<UserNotifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
