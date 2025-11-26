import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks, submitTaskReport } from "../../pages/features/taskSlice";

const UserTasks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // currentUser
  const { tasks, loading, error, updating } = useSelector((state) => state.task);
  const [selectedTask, setSelectedTask] = useState(null);
  const [report, setReport] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchUserTasks(user.uid));
    }
  }, [user, dispatch]);

  const openReportModal = (task) => {
    setSelectedTask(task);
    setReport(task.report || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setReport("");
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
      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}
      <ul className="list-disc pl-5 flex flex-wrap justify-center gap-4">
        {tasks.map((task) => (
          <li
            className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-4 mb-4 flex flex-col gap-2"
            key={task.id}
          >
            <div>
              <strong>{task.title}</strong>
              <p className="text-sm text-gray-600">Status: {task.status || "pending"}</p>
            </div>
            <p>{task.description}</p>
            {task.report && (
              <p className="text-sm text-gray-500">Your report: {task.report}</p>
            )}
            <button className="btn btn-sm self-end" onClick={() => openReportModal(task)}>
              {task.report ? "Update Report" : "Submit Report"}
            </button>
          </li>
        ))}
      </ul>

      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`} open={isModalOpen}>
        <div className="modal-box space-y-4">
          <h3 className="text-lg font-semibold">Submit Task Report</h3>
          {selectedTask && (
            <form className="space-y-3" onSubmit={handleSubmitReport}>
              <div>
                <p className="text-sm font-medium">Task: {selectedTask.title}</p>
                <p className="text-xs text-gray-500">{selectedTask.description}</p>
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
    </div>
  );
};

export default UserTasks;
