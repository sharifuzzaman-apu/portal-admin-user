import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.init.js";

// thunk for adding a task by admin
export const addTask = createAsyncThunk(
  "task/addTask",
  async ({ title, description, assignedTo, assignedEmail = "" }, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        assignedTo,
        assignedEmail,
        report: "",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        title,
        description,
        assignedTo,
        assignedEmail,
        report: "",
        status: "pending",
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// admin fetches all tasks
export const fetchAllTasks = createAsyncThunk(
  "task/fetchAllTasks",
  async (_, thunkAPI) => {
    try {
      const snaps = await getDocs(collection(db, "tasks"));
      const tasks = [];
      snaps.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));
      return tasks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// users fetches their tasks from admin

export const fetchUserTasks = createAsyncThunk(
  "task/fetchUserTasks",
  async (userId, thunkAPI) => {
    try {
      const q = query(
        collection(db, "tasks"),
        where("assignedTo", "==", userId)
      );
      const snaps = await getDocs(q);
      const tasks = [];
      snaps.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));
      return tasks;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// user submits a report/update for their task
export const submitTaskReport = createAsyncThunk(
  "task/submitTaskReport",
  async ({ taskId, report }, thunkAPI) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        report,
        status: "reported",
      });
      return { taskId, report, status: "reported" };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// delete a task
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId, thunkAPI) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      return taskId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    updating: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(submitTaskReport.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(submitTaskReport.fulfilled, (state, action) => {
        state.updating = false;
        const { taskId, report, status } = action.payload;
        const task = state.tasks.find((item) => item.id === taskId);
        if (task) {
          task.report = report;
          task.status = status;
        }
      })
      .addCase(submitTaskReport.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});
export default taskSlice.reducer;
