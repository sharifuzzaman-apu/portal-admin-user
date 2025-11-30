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
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase.init.js";

//adding a task by admin
export const addTask = createAsyncThunk(
  "task/addTask",
  async ({ title, description, assignedTo, assignedEmail = "", deadline = "" }, thunkAPI) => {
    try {
      const deadlineTimestamp = deadline
        ? Timestamp.fromDate(new Date(deadline))
        : null;
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        assignedTo,
        assignedEmail,
        report: "",
        status: "pending",
        deadline: deadlineTimestamp,
        comment: "",
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
        deadline: deadlineTimestamp,
        comment: "",
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// admin show all tasks
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


// users show their tasks from admin
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

// user report in task
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

// user marks task as done
export const markTaskDone = createAsyncThunk(
  "task/markTaskDone",
  async (taskId, thunkAPI) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "done",
      });
      return { taskId, status: "done" };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// admin adds comment for user
export const updateTaskComment = createAsyncThunk(
  "task/updateTaskComment",
  async ({ taskId, comment }, thunkAPI) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        comment,
      });
      return { taskId, comment };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// delete task
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
      })
      .addCase(markTaskDone.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(markTaskDone.fulfilled, (state, action) => {
        state.updating = false;
        const { taskId, status } = action.payload;
        const task = state.tasks.find((item) => item.id === taskId);
        if (task) {
          task.status = status;
        }
      })
      .addCase(markTaskDone.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      .addCase(updateTaskComment.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTaskComment.fulfilled, (state, action) => {
        state.updating = false;
        const { taskId, comment } = action.payload;
        const task = state.tasks.find((item) => item.id === taskId);
        if (task) {
          task.comment = comment;
        }
      })
      .addCase(updateTaskComment.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});
export default taskSlice.reducer;
