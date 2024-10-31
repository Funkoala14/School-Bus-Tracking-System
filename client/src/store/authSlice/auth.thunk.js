import { createAsyncThunk } from '@reduxjs/toolkit';
import { post } from '../../services/api';

export const loginThunk = createAsyncThunk('auth/login', async ({ userName, password }, { rejectWithValue }) => {
    try {
        const { data, message } = await post('/auth/login', { userName, password });
        // Assuming the response structure: { message, code, data: { userId, userName, role } }
        return data; // Return user data if successful
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

const signupThunk = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
    try {
        console.log('Sending credentials:', credentials);
        // Sending a request to the backend to register the user
        const { data } = await post('/auth/register', credentials);

        return data;
    } catch (error) {
        // Catching the error and passing the appropriate message
        const errorMessage = error.response?.data || 'Signup failed. Please try again.';
        return rejectWithValue(errorMessage);
    }
});

const verifyThunk = createAsyncThunk('auth/verify', async (_, { rejectWithValue }) => {
    try {
        const { data, message } = await get('/auth/verify');

        if (!data) {
            throw new Error(message || 'No token found');
        }
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Token verification failed');
    }
});

// Async thunk for logging out
const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
    try {
        // Send the logout request to the server (this assumes your server clears any session-related info)
        await get('/auth/logout');
        await localStorage.removeItem('persist:root');
        window.location.href = '/login';
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Logout failed');
    }
});

export { loginThunk, signupThunk, verifyThunk, logoutThunk };
