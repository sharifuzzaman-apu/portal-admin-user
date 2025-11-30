import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUserTasks, submitTaskReport, markTaskDone } from "../../pages/features/taskSlice";

const UserTasks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // currentUser
  const { tasks, loading, error, updating } = useSelector((state) => state.task);
  const [selectedTask, setSelectedTask] = useState(null);
  const [report, setReport] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [commentModalTask, setCommentModalTask] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [highlightTaskId, setHighlightTaskId] = useState(null);
  const taskRefs = useRef({});
  const location = useLocation();
  const navigate = useNavigate();

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "No deadline";
    }
    if (deadline.toDate) {
      return deadline.toDate().toLocaleDateString();
    }
    if (deadline.seconds) {
      return new Date(deadline.seconds * 1000).toLocaleDateString();
    }
    const parsed = new Date(deadline);
    return Number.isNaN(parsed.getTime()) ? "No deadline" : parsed.toLocaleDateString();
  };

  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchUserTasks(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!highlightTaskId) {
      return;
    }
    const targetTask = tasks.find((task) => task.id === highlightTaskId);
    if (!targetTask) {
      return;
    }
    if (targetTask.status === "done") {
      setActiveTab("done");
    } else if (targetTask.status === "reported") {
      setActiveTab("reported");
    } else {
      setActiveTab("pending");
    }
  }, [highlightTaskId, tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "done") {
      return task.status === "done";
    }
    if (activeTab === "reported") {
      return task.status === "reported";
    }
    return !task.status || task.status === "pending";
  });

  useEffect(() => {
    if (location.state?.taskId) {
      setHighlightTaskId(location.state.taskId);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (highlightTaskId && taskRefs.current[highlightTaskId]) {
      taskRefs.current[highlightTaskId].scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = setTimeout(() => setHighlightTaskId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightTaskId, filteredTasks]);

  const openReportModal = (task) => {
    setSelectedTask(task);
    setReport(task.report || "");
    setIsModalOpen(true);
  };

  const openCommentModal = (task) => {
    setCommentModalTask(task);
    setIsCommentModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setReport("");
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setCommentModalTask(null);
  };

  const handleMarkDone = (taskId) => {
    dispatch(markTaskDone(taskId));
  };

  const handleSubmitReport = (event) => {
    event.preventDefault();
    if (!selectedTask) return;
    dispatch(submitTaskReport({ taskId: selectedTask.id, report })).then((action) => {
      if (!action.error) {
        closeModal();
      }
    });
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <div className="tabs tabs-boxed w-fit mb-4">
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
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr
                    key={task.id}
                    ref={(node) => {
                      if (node) {
                        taskRefs.current[task.id] = node;
                      }
                    }}
                    className={highlightTaskId === task.id ? "bg-primary/10" : ""}
                  >
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{formatDeadline(task.deadline)}</td>
                    <td>
                      <div className="flex gap-2">
                        {task.comment && (
                          <button className="btn btn-xs btn-outline" onClick={() => openCommentModal(task)}>
                            View Comment
                          </button>
                        )}
                        <button className="btn btn-xs" onClick={() => openReportModal(task)}>
                          {task.report ? "Update Report" : "Submit Report"}
                        </button>
                        <button
                          className={`btn btn-xs btn-success ${updating ? "loading" : ""}`}
                          onClick={() => handleMarkDone(task.id)}
                          disabled={task.status === "done" || updating}
                        >
                          {task.status === "done" ? "Completed" : "Mark Done"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`} open={isModalOpen}>
        <div className="modal-box space-y-4">
          <h3 className="text-lg font-semibold">Submit Task Report</h3>
          {selectedTask && (
            <form className="space-y-3" onSubmit={handleSubmitReport}>
              <div>
                <p className="text-sm font-medium">Task: {selectedTask.title}</p>
                <p className="text-xs text-gray-500">{selectedTask.description}</p>
                <p className="text-xs text-gray-500">Deadline: {formatDeadline(selectedTask.deadline)}</p>
                {selectedTask.comment && (
                  <p className="text-xs text-blue-600">Admin comment: {selectedTask.comment}</p>
                )}
              </div>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Describe your progress or blockers"
                rows={4}
                value={report}
                onChange={(event) => setReport(event.target.value)}
                required
              ></textarea>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={`btn btn-primary ${updating ? "loading" : ""}`} disabled={updating}>
                  {updating ? "Saving" : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal}>
            close
          </button>
        </form>
      </dialog>

      <dialog className={`modal ${isCommentModalOpen ? "modal-open" : ""}`} open={isCommentModalOpen}>
        <div className="modal-box space-y-3">
          <h3 className="text-lg font-semibold">Task Comment</h3>
          {commentModalTask ? (
            <div className="space-y-2 text-sm">
              <p className="font-medium">{commentModalTask.title}</p>
              <p className="text-gray-500">
                {commentModalTask.comment || "No comment provided."}
              </p>
            </div>
          ) : (
            <p className="text-sm">No comment available.</p>
          )}
          <div className="modal-action">
            <button type="button" className="btn" onClick={closeCommentModal}>
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeCommentModal}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default UserTasks;
