import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks } from "../../pages/features/taskSlice";

const UserHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading } = useSelector((state) => state.task);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserTasks(user.uid));
    }
  }, [dispatch, user?.uid]);

  const pendingCount = tasks.filter((task) => !task.status || task.status === "pending").length;
  const reportedCount = tasks.filter((task) => task.status === "reported").length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Pending Tasks</h2>
          <p className="text-sm text-gray-500">Work still to complete</p>
          <span className="text-4xl font-bold">{loading ? "..." : pendingCount}</span>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Reported Tasks</h2>
          <p className="text-sm text-gray-500">Submitted for review</p>
          <span className="text-4xl font-bold">{loading ? "..." : reportedCount}</span>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Done Tasks</h2>
          <p className="text-sm text-gray-500">Completed assignments</p>
          <span className="text-4xl font-bold">{loading ? "..." : doneCount}</span>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
