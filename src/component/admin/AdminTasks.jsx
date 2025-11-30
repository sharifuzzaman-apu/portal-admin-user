import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks, deleteTask, updateTaskComment } from "../../pages/features/taskSlice";
import { fetchUsers } from "../../pages/features/userSlice";

const AdminTasks = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const { tasks, loading, error, updating } = useSelector((state) => state.task);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [commentText, setCommentText] = useState("");

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

  const handleSaveComment = () => {
    if (!selectedTask) {
      return;
    }
    dispatch(updateTaskComment({ taskId: selectedTask.id, comment: commentText })).then((action) => {
      if (!action.error) {
        setSelectedTask((prev) => (prev ? { ...prev, comment: commentText } : prev));
      }
    });
  };

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "done") {
      return task.status === "done";
    }
    if (activeTab === "reported") {
      return task.status === "reported";
    }
    return !task.status || task.status === "pending";
  });

  return (
    <div className="space-y-6">
      <div className="tabs tabs-boxed w-fit">
        <button
          type="button"
          className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "reported" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reported")}
        >
          Reported
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "done" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("done")}
        >
          Done
        </button>
      </div>

      <div className="card bg-base-100 shadow-2xl p-4">
        <h3 className="text-lg font-semibold mb-3 capitalize">{activeTab} tasks</h3>
        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredTasks.length === 0 && (
          <p className="text-sm text-gray-500">No tasks in this list.</p>
        )}
        {!loading && filteredTasks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => {
                  const assignee = users.find((user) => user.id === task.assignedTo);
                  return (
                    <tr key={task.id}>
                      <td>{index + 1}</td>
                      <td>{task.title}</td>
                      <td>{task.assignedEmail || assignee?.email || assignee?.name || task.assignedTo}</td>
                      <td>{formatDeadline(task.deadline)}</td>
                      <td>
                        <div className="flex gap-2">
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
                              setCommentText(task.comment || "");
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`} open={isModalOpen}>
        <div className="modal-box space-y-3">
          <h3 className="text-lg font-bold">Task Details</h3>
          {selectedTask ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Title:</span> {selectedTask.title}</p>
              <p><span className="font-semibold">Description:</span> {selectedTask.description}</p>
              <p><span className="font-semibold">Assigned To:</span> {selectedTask.assigneeDisplay}</p>
              <p><span className="font-semibold">Deadline:</span> {formatDeadline(selectedTask.deadline)}</p>
              <p><span className="font-semibold">Status:</span> {selectedTask.status || "pending"}</p>
              <p><span className="font-semibold">Report:</span> {selectedTask.report || "No report submitted yet."}</p>
              <p><span className="font-semibold">Created:</span> {selectedTask.createdAt?.seconds ? new Date(selectedTask.createdAt.seconds * 1000).toLocaleString() : "—"}</p>
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="admin-comment">
                  Comment to user
                </label>
                <textarea
                  id="admin-comment"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="Share guidance or feedback"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                ></textarea>
                <p className="text-xs text-gray-500">Users can read this comment in their task view.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm">No task selected.</p>
          )}
          <div className="modal-action">
            <button
              type="button"
              className={`btn btn-primary ${updating ? "loading" : ""}`}
              onClick={handleSaveComment}
              disabled={updating}
            >
              {updating ? "Saving" : "Save Comment"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTask(null);
                setCommentText("");
              }}
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
              setCommentText("");
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
