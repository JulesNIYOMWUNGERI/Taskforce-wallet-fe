import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../lib/api";
import { toast } from "react-toastify";

const signin = createAsyncThunk(
    "signin",
    async (data: any, { rejectWithValue }) => {
      try {
        const response = await api.post(`/auth/login`, data);

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        toast.error((axiosError?.response?.data as { message: string })?.message)
        return rejectWithValue({ error: axiosError?.response });
      }
    }
);

const signup = createAsyncThunk(
    "signup",
    async (data: any, { rejectWithValue }) => {
      try {
        const response = await api.post(`/users/signup`, data);

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        toast.error((axiosError?.response?.data as { message: string })?.message)
        return rejectWithValue({ error: axiosError?.response });
      }
    }
);

const getAccounts = createAsyncThunk(
    "getAccounts",
    async (token: string, { rejectWithValue }) => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await api.get(`/accounts`, {headers});

        return response.data;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        toast.error((axiosError?.response?.data as { message: string })?.message)
        return rejectWithValue({ error: axiosError?.response });
      }
    }
);

const createAccount = createAsyncThunk(
  "createAccount",
  async (data: { formData: any, token: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.post('/accounts', data?.formData, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const updateAccount = createAsyncThunk(
  "updateAccount",
  async (data: { updatedAccount: any, token: string, accountId: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      console.log()

      const response = await api.put(`/accounts/${data?.accountId}`, data?.updatedAccount, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const deleteAccount = createAsyncThunk(
  "deleteAccount",
  async (data: {id: string, token: string}, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.delete(`/accounts/${data?.id}`, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);


const getTransactions = createAsyncThunk(
  "getTransactions",
  async (token: string, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await api.get(`/transactions`, {headers});

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const reset = createAction('reset');

export const apis = { signin, signup, getAccounts, createAccount, updateAccount, deleteAccount, getTransactions, reset }
