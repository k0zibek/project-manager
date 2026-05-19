import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'context/actions/auth/authSlice';
import projectsReducer from 'context/actions/project/projectSlice';
import taskReducer from 'context/actions/task/taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
