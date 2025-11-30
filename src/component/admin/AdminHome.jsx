import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../pages/features/userSlice";
import { fetchAllTasks } from "../../pages/features/taskSlice";

const AdminHome = () => {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.task);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (!tasks.length) {
      dispatch(fetchAllTasks());
    }
  }, [dispatch, tasks.length]);

  const totalUsers = users.length;
  const pendingTasks = tasks.filter((task) => !task.status || task.status === "pending").length;
  const reportedTasks = tasks.filter((task) => task.status === "reported").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <p className="text-sm text-gray-500">Total registered users</p>
          <div className="text-4xl font-bold">
            {usersLoading ? "..." : totalUsers}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Task Status</h2>
          <p className="text-sm text-gray-500">Overview of assigned tasks</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Pending</span>
              <span className="font-semibold">{tasksLoading ? "..." : pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reported</span>
              <span className="font-semibold">{tasksLoading ? "..." : reportedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Done</span>
              <span className="font-semibold">{tasksLoading ? "..." : doneTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
