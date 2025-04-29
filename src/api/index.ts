import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { loginSchema, signupSchema, verifySchema } from '../validation';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json'
   },
   withCredentials: true
});
export const REQUESTS = {
   SIGN_UP: async ({ data }: { data: z.infer<typeof signupSchema> }) => {
      try {
         const response = await API.post<User>('/auth/register', data);
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   },
   LOGIN: async ({ data }: { data: z.infer<typeof loginSchema> }) => {
      try {
         const response = await API.post<User>('/auth/login', data);
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   },
   LOGOUT: async () => {
      try {
         const response = await API.post<User>('/auth/logout');
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   },
   VERIFY: async ({ data }: { data: z.infer<typeof verifySchema> }) => {
      try {
         const response = await API.post<User>('/auth/email/verify', data);
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   },
   RESEND: async () => {
      try {
         const response = await API.post<User>('/auth/email/resend');
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   },
   MYSELF: async () => {
      try {
         const response = await API.get<User>('/users/me');
         return response.data;
      } catch (error) {
         if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message);
         }
         return null;
      }
   }
};
