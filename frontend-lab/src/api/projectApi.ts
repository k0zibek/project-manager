import axiosInstance from 'api/axiosInstance';
import type { IProject } from 'constants/types';

export const getAllProjectsApi = async () => axiosInstance.get('/projects');

export const getProjectByIdApi = async (projectId: string) => axiosInstance.get(`/projects/${projectId}`);

export const createProjectApi = async (data: Omit<IProject, 'id'>) => axiosInstance.post('/projects', data);
