import {
  type CaseReducer,
  createSlice,
  type PayloadAction,
  type SerializedError,
} from '@reduxjs/toolkit';
import {
  fetchProjectById,
  fetchProjects,
  postProject,
} from 'context/actions/project/projectThunks';
import type { IProject, ProjectsState } from 'constants/types';
import { INITIAL_PROJECT_STATE } from 'context/actions/project/config';

const setError: CaseReducer<ProjectsState, PayloadAction<SerializedError>> = (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
};

const setLoading: CaseReducer<ProjectsState> = (state) => {
  state.loading = true;
  state.error = null;
};

/* eslint no-param-reassign: "error" */
const projectSlice = createSlice({
  name: 'projects',
  initialState: INITIAL_PROJECT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<IProject[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<IProject>) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(postProject.fulfilled, (state, action: PayloadAction<IProject>) => {
        state.loading = false;

        if (state.projects) {
          state.projects.push(action.payload);
        }
      })
      .addCase(fetchProjects.pending, setLoading)
      .addCase(postProject.pending, setLoading)
      .addCase(fetchProjectById.pending, setLoading)
      .addCase(postProject.rejected, setError)
      .addCase(fetchProjects.rejected, setError)
      .addCase(fetchProjectById.rejected, setError);
  },
});

export default projectSlice.reducer;
