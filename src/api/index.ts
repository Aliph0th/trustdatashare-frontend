import axios, { AxiosError, AxiosResponse } from 'axios';
import { z } from 'zod';
import { ApiException } from '../exceptions';
import { Data, PostsResponse, PublicUser, Sessions, User } from '../types';
import { createDataSchema, loginSchema, patchUserSchema, signupSchema, verifySchema } from '../validation';

const API_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json'
   },
   withCredentials: true
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiCall = async <T = any>(callback: () => Promise<AxiosResponse<T, any>>) => {
   try {
      const response = await callback();
      return response.data;
   } catch (error) {
      if (error instanceof AxiosError) {
         throw new ApiException(error?.response?.data?.message, error.status);
      }
      return null;
   }
};

export const REQUESTS = {
   SIGN_UP: async (data: z.infer<typeof signupSchema>) => {
      return apiCall(() => API.post<User>('/auth/register', data));
   },
   LOGIN: async (data: z.infer<typeof loginSchema>) => {
      return apiCall(() => API.post<User>('/auth/login', data));
   },
   LOGOUT: async () => {
      return apiCall(() => API.post('/auth/logout'));
   },
   VERIFY: async (data: z.infer<typeof verifySchema>) => {
      return apiCall(() => API.post('/auth/email/verify', data));
   },
   CHANGE_AVATAR: async (data: FormData) => {
      return apiCall(() =>
         API.patch<{ url: string }>('/users/avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      );
   },
   RESEND: async () => {
      return apiCall(() => API.post<{ cooldown: number }>('/auth/email/resend'));
   },
   CREATE_POST: async (data: z.infer<typeof createDataSchema>) => {
      return apiCall(() => API.post<{ id: string }>('/data', data));
   },
   GET_POST: async ({ id, password }: { id: string; password?: string }) => {
      const headers: Record<string, string> = {};
      if (password) {
         headers.Authorization = `Basic ${password}`;
      }
      const data = await apiCall(() => API.get<Data>(`/data/${id}`, { headers }));
      return { ...data, createdAt: new Date(data.createdAt), updatedAt: new Date(data.updatedAt) };
   },
   GET_MY_POSTS: async (params: { page?: number; limit?: number }) => {
      return apiCall(() => API.get<PostsResponse>('/data/my', { params }));
   },
   GET_USER_POSTS: async (id: number, params: { page?: number; limit?: number }) => {
      return apiCall(() => API.get<PostsResponse>(`/data/visible/${id}`, { params }));
   },
   GET_MYSELF: async () => {
      return apiCall(() => API.get<User>('/users/me'));
   },
   GET_USER: async (id: number) => {
      return apiCall(() => API.get<PublicUser>(`/users/${id}`));
   },
   GET_SESSIONS: async () => {
      return apiCall(() => API.get<Sessions>('/sessions/me'));
   },
   DELETE_SESSION: async (id: string) => {
      return apiCall(() => API.delete(`/sessions/${id}`));
   },
   DELETE_DATA: async (id: string) => {
      return apiCall(() => API.delete(`/data/${id}`));
   },
   PATCH_USER: async (data: z.infer<typeof patchUserSchema>) => {
      return apiCall(() => API.patch<Omit<User, 'sessions'>>('/users/me', data));
   },
   CHECK_CREDENTIALS: async <T extends { username?: string; email?: string }>(credentials: T) => {
      return apiCall(() => API.get<{ [K in keyof T]: T[K] }>('/users/availability', { params: credentials }));
   }
};
