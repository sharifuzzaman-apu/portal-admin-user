import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../pages/features/userSlice";
import { addTask } from "../../pages/features/taskSlice";

const AdminAssignTask = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const { loading, error } = useSelector((state) => state.task);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assignedEmail: "",
    deadline: "",
  });

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "assignedTo") {
      const selectedUser = users.find((user) => user.id === value);
      setForm((prev) => ({
        ...prev,
        assignedTo: value,
        assignedEmail: selectedUser?.email || selectedUser?.name || "",
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title || !form.description || !form.assignedTo) {
      return;
    }
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
      deadline: "",
    });
  };

  return (
    <div className="card bg-base-100 shadow-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-center">Assign New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          rows={3}
          required
        />
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email || user.id}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <button className={`btn btn-neutral w-full ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
          {loading ? "Assigning..." : "Assign Task"}
        </button>
      </form>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default AdminAssignTask;
