import { taskActions } from 'context/actions/task/taskSlice';
import {
  deleteCommentApi,
  deleteTaskApi,
  getAllTasksApi,
  getTaskCommentsApi,
  getUserTasksApi,
  postCommentApi,
  postTaskApi, updateTaskApi,
} from 'api/taskApi';
import type { IComment, ITask } from 'constants/types';
import type { AppDispatch } from 'context/store';

export const fetchTasks = (projectId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const data: ITask[] = await getAllTasksApi(projectId);

    dispatch(taskActions.fetchTasksSuccess(data));
  } catch (error:any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const updateTask = (taskId: string, data: Partial<ITask>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const { data: responseData } = await updateTaskApi(taskId, data);

    dispatch(taskActions.fetchTaskByIdSuccess(responseData));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const postTask = (task: Omit<ITask, 'id'>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const { data } = await postTaskApi(task);

    dispatch(taskActions.createTaskSuccess(data));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const fetchTaskComments = (taskId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const data: ITask = await getTaskCommentsApi(taskId);

    dispatch(taskActions.fetchTaskByIdSuccess(data));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const fetchUserTasks = (userId : number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const data: ITask[] = await getUserTasksApi(userId);

    dispatch(taskActions.fetchUserTasksSuccess(data));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const deleteTask = (taskId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    await deleteTaskApi(taskId);

    dispatch(taskActions.deleteTaskSuccess(taskId));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};

export const postComment = (comment: Omit<IComment, 'id'>) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    const { data } = await postCommentApi(comment);

    dispatch(taskActions.createCommentSuccess(data));
  } catch (error: any) {
    dispatch(taskActions.requestStart(error.message));

    throw error.message;
  }
};

export const deleteComment = (commentId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(taskActions.requestStart());

    await deleteCommentApi(commentId);

    dispatch(taskActions.deleteCommentSuccess(commentId));
  } catch (error: any) {
    dispatch(taskActions.requestFailure(error.message));

    throw error.message;
  }
};
