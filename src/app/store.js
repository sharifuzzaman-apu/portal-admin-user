import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../pages/features/authSlice.js'
import userReducer from '../pages/features/userSlice.js'
import taskReducer from '../pages/features/taskSlice.js'

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    task: taskReducer,
  },
})