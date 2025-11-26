import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  fetchAllTasks,
  deleteTask,
} from "../../pages/features/taskSlice";
import { fetchUsers } from "../../pages/features/userSlice";

const AdminTasks = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const { tasks, loading, error } = useSelector((state) => state.task);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assignedEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "assignedTo") {
      const selectedUser = users.find((user) => user.id === value);
      setForm((prev) => ({
        ...prev,
        assignedTo: value,
        assignedEmail: selectedUser?.email || selectedUser?.name || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignee = users.find((user) => user.id === form.assignedTo);
    dispatch(
      addTask({
        ...form,
        assignedEmail: form.assignedEmail || assignee?.email || assignee?.name || "",
      })
    );
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      assignedEmail: "",
    });
  };
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 w-full shadow-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">Assign New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email || user.id}
              </option>
            ))}
          </select>
          <button className="btn btn-neutral w-full" type="submit">
            Assign Task
          </button>
        </form>
      </div>

      <div className="card bg-base-100 w-full shadow-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Assigned Tasks</h3>
        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && tasks.length === 0 && (
          <p className="text-sm text-gray-500">No tasks assigned yet.</p>
        )}
        <ul className="space-y-3">
          {tasks.map((task) => {
            const assignee = users.find((user) => user.id === task.assignedTo);
            return (
              <li key={task.id} className="rounded border border-base-300 p-3 text-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-gray-500">
                      {task.assignedEmail || assignee?.email || assignee?.name || task.assignedTo}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end md:justify-start">
                    <button
                      type="button"
                      className="btn btn-xs"
                      onClick={() => {
                        setSelectedTask({
                          ...task,
                          report: task.report || "",
                          assigneeDisplay:
                            task.assignedEmail || assignee?.email || assignee?.name || task.assignedTo,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Progress
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-error"
                      onClick={() => dispatch(deleteTask(task.id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`} open={isModalOpen}>
        <div className="modal-box space-y-3">
          <h3 className="text-lg font-bold">Task Details</h3>
          {selectedTask ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Title:</span> {selectedTask.title}</p>
              <p><span className="font-semibold">Description:</span> {selectedTask.description}</p>
              <p><span className="font-semibold">Assigned To:</span> {selectedTask.assigneeDisplay}</p>
              <p><span className="font-semibold">Status:</span> {selectedTask.status || "pending"}</p>
              <p><span className="font-semibold">Report:</span> {selectedTask.report || "No report submitted yet."}</p>
              <p><span className="font-semibold">Created:</span> {selectedTask.createdAt?.seconds ? new Date(selectedTask.createdAt.seconds * 1000).toLocaleString() : "—"}</p>
            </div>
          ) : (
            <p className="text-sm">No task selected.</p>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTask(null);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};
export default AdminTasks;
