import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IComment, ITask } from 'constants/types';
import { INITIAL_TASK_STATE } from 'context/actions/task/config';

/* eslint no-param-reassign: "error" */
const taskSlice = createSlice({
  name: 'tasks',
  initialState: INITIAL_TASK_STATE,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    requestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTasksSuccess: (state, action: PayloadAction<ITask[]>) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTaskByIdSuccess: (state, action: PayloadAction<ITask>) => {
      state.loading = false;
      state.currentTask = action.payload;

      if (state.tasks) {
        state.tasks = state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            return action.payload;
          }

          return task;
        });
      }
    },
    fetchUserTasksSuccess: (state, action: PayloadAction<ITask[]>) => {
      state.loading = false;
      state.userTasks = action.payload;
    },
    createTaskSuccess: (state, action: PayloadAction<ITask>) => {
      state.loading = false;

      if (state.tasks) {
        state.tasks.push(action.payload);
      }
    },
    deleteTaskSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;

      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    createCommentSuccess: (state, action: PayloadAction<IComment>) => {
      state.loading = false;

      state.currentTask.comments.push(action.payload);
    },
    deleteCommentSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;

      state.currentTask.comments = state.currentTask.comments.filter((comment) => comment.id !== action.payload);
    },
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;
