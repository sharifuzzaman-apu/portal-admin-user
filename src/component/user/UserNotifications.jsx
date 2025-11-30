import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserTasks } from "../../pages/features/taskSlice";

const UserNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, error } = useSelector((state) => state.task);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTasks(user.uid));
    }
  }, [dispatch, user?.uid]);

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

  const notifications = tasks.flatMap((task) => {
    const items = [];
    items.push({
      id: `${task.id}-assigned`,
      taskId: task.id,
      message: `You have a new task: ${task.title}`,
      timestamp: task.createdAt?.seconds ? new Date(task.createdAt.seconds * 1000).toLocaleString() : "—",
    });
    if (task.comment) {
      items.push({
        id: `${task.id}-comment`,
        taskId: task.id,
        message: `Admin commented on: ${task.title}`,
        timestamp: task.updatedAt?.seconds ? new Date(task.updatedAt.seconds * 1000).toLocaleString() : "—",
      });
    }
    return items;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Notifications</h2>
      {loading && <p>Loading notifications...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && notifications.length === 0 && (
        <p className="text-sm text-gray-500">No notifications yet.</p>
      )}
      {!loading && notifications.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Notification</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => (
                <tr
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/user/tasks", { state: { taskId: item.taskId } });
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{item.message}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
