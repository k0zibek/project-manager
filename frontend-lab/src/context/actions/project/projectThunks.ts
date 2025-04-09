import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProjectApi,
  getAllProjectsApi,
  getProjectByIdApi,
} from 'api/projectApi';
import type { IProject } from 'constants/types';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, thunkAPI) => {
    try {
      const { data } = await getAllProjectsApi();

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId: string, thunkAPI) => {
    try {
      const { data } = await getProjectByIdApi(projectId);

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const postProject = createAsyncThunk(
  'projects/createProject',
  async (project: Omit<IProject, 'id'>, thunkAPI) => {
    try {
      const { data } = await createProjectApi(project);

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
