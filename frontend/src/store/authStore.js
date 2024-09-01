import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/auth" : "/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/signup`, {...formData});
            set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/verify-email`, { verificationCode });
            set({ user: res.data.user, isAuthenticated: true, isLoading: false });
            return res.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    login: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/login`, {...formData});
            set({ user: res.data.user, error: null, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({ user: null, error: null, isAuthenticated: false,  isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/check-auth`);
            set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isAuthenticated: false, isCheckingAuth: false });
        }              
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: res.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error sending reset password email", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({ message: res.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error resetting password", isLoading: false });
            throw error;
        }
    },
}));