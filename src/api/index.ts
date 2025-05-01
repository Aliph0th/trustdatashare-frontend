import { z } from 'zod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { createDataSchema, loginSchema, signupSchema, verifySchema } from '../validation';
import { Data, User } from '../types';
import { ApiException } from '../exceptions';

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
   SIGN_UP: async ({ data }: { data: z.infer<typeof signupSchema> }) => {
      return apiCall(() => API.post<User>('/auth/register', data));
   },
   LOGIN: async ({ data }: { data: z.infer<typeof loginSchema> }) => {
      return apiCall(() => API.post<User>('/auth/login', data));
   },
   LOGOUT: async () => {
      return apiCall(() => API.post('/auth/logout'));
   },
   VERIFY: async ({ data }: { data: z.infer<typeof verifySchema> }) => {
      return apiCall(() => API.post('/auth/email/verify', data));
   },
   RESEND: async () => {
      return apiCall(() => API.post('/auth/email/resend'));
   },
   CREATE_POST: async ({ data }: { data: z.infer<typeof createDataSchema> }) => {
      return apiCall(() => API.post<{ id: string }>('/data', data));
   },
   GET_POST: async ({ id, password }: { id: string; password?: string }) => {
      const headers: Record<string, string> = {};
      if (password) {
         headers.Authorization = `Basic ${password}`;
      }
      return apiCall(() => API.get<Data>(`/data/${id}`, { headers }));
   },
   MYSELF: async () => {
      return apiCall(() => API.get<User>('/users/me'));
   }
};
