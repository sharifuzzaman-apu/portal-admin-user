import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchUsers } from "../../pages/features/userSlice";
import { fetchAllTasks } from "../../pages/features/taskSlice";

const AdminUserOverview = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { tasks, loading: tasksLoading, error } = useSelector((state) => state.task);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  const user = useMemo(() => users.find((item) => item.id === userId || item.uid === userId), [users, userId]);

  const userTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === userId),
    [tasks, userId]
  );

  const pendingTasks = userTasks.filter((task) => !task.status || task.status === "pending");
  const reportedTasks = userTasks.filter((task) => task.status === "reported");
  const doneTasks = userTasks.filter((task) => task.status === "done");

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "—";
    }
    if (deadline.toDate) {
      return deadline.toDate().toLocaleDateString();
    }
    if (deadline.seconds) {
      return new Date(deadline.seconds * 1000).toLocaleDateString();
    }
    const parsed = new Date(deadline);
    return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Overview</h1>
          {user ? (
            <p className="text-sm text-gray-500">{user.email}</p>
          ) : (
            <p className="text-sm text-gray-500">Loading user information...</p>
          )}
        </div>
        <Link to="/admin/users" className="btn btn-sm btn-outline">
          Back to Users
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[{ label: "Pending", value: pendingTasks.length }, { label: "Reported", value: reportedTasks.length }, { label: "Done", value: doneTasks.length }].map(({ label, value }) => (
          <div key={label} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{label}</h2>
              <span className="text-4xl font-bold">{tasksLoading ? "..." : value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-100 shadow-2xl p-4">
        <h2 className="text-lg font-semibold mb-3">Task Activity</h2>
        {(usersLoading || tasksLoading) && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!tasksLoading && userTasks.length === 0 && (
          <p className="text-sm text-gray-500">No tasks assigned to this user yet.</p>
        )}
        {!tasksLoading && userTasks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Report</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td className="capitalize">{task.status || "pending"}</td>
                    <td>{formatDeadline(task.deadline)}</td>
                    <td>{task.report || "—"}</td>
                    <td>{task.comment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserOverview;
