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

const createTransaction = createAsyncThunk(
  "createTransaction",
  async (data: { formData: any, token: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const {accountId, categoryId, subCategoryId, ...bodyData} = data?.formData

      const response = await api.post(`/transactions/${accountId}/${subCategoryId}`, bodyData, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const updateTransaction = createAsyncThunk(
  "updateTransaction",
  async (data: { updatedTransaction: any, token: string, transactionId: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.put(`/transactions/${data?.transactionId}`, data?.updatedTransaction, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const deleteTransaction = createAsyncThunk(
  "deleteTransaction",
  async (data: {id: string, token: string}, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.delete(`/transactions/${data?.id}`, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const generateReport = createAsyncThunk(
  "generateReport",
  async (data: {formData: { startDate: string, endDate: string }, token: string}, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const {startDate, endDate} = data?.formData;

      const response = await api.get(`/transactions/report/pdf?startDate=${startDate}&endDate=${endDate}`, {headers,   responseType: 'blob'});

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const link = document.createElement('a');

      link.href = URL.createObjectURL(blob);
      link.download = 'transactions_report.pdf';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const getCategories = createAsyncThunk(
  "getCategories",
  async (token: string, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await api.get(`/categories`, {headers});

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const createCategory = createAsyncThunk(
  "createCategory",
  async (data: { formData: any, token: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.post('/categories', data?.formData, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const updateCategory = createAsyncThunk(
  "updateCategory",
  async (data: { updatedCategory: any, token: string, categoryId: string }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.put(`/categories/${data?.categoryId}`, data?.updatedCategory, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const deleteCategory = createAsyncThunk(
  "deleteCategory",
  async (data: {id: string, token: string}, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data?.token}`,
      };

      const response = await api.delete(`/categories/${data?.id}`, { headers });

      toast.success(response?.data?.message)

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error((axiosError?.response?.data as { message: string })?.message)
      return rejectWithValue({ error: axiosError?.response });
    }
  }
);

const reset = createAction('reset');

export const apis = { signin, signup, getAccounts, createAccount, updateAccount, deleteAccount, getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories, createCategory, updateCategory, deleteCategory, generateReport, reset }
