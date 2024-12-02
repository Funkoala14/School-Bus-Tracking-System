import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../services/api';
import { showNotification } from '../notificationSlice/notification.slice';
import { getParentProfileThunk } from '../parentSlice/parent.thunk';
import { getDriverInfo } from '../driverSlice/driver.thunk';

export const loginThunk = createAsyncThunk('auth/login', async ({ userName, password }, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/auth/login', { userName, password });
        // Assuming the response structure: { message, code, data: { userId, userName, role } }
        const { role } = data;
        let path = 'home';
        switch (role) {
            case 'Admin':
                path = 'route-management';
                break;

            case 'Parent':
                path = 'bus-tracker';
                await dispatch(getParentProfileThunk());
                break;

            case 'Driver':
                path = 'tracker';
                await dispatch(getDriverInfo());
                break;

            default:
                break;
        }
        window.location.href = `/${role.toLowerCase()}/${path}`;
        return data; // Return user data if successful
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

export const signupThunk = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
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

export const verifyThunk = createAsyncThunk('auth/verify', async (_, { rejectWithValue }) => {
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
export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue, dispatch }) => {
    try {
        // Send the logout request to the server (this assumes your server clears any session-related info)
        const res = await get('/auth/logout');
        await localStorage.removeItem('persist:root');
        window.location.href = '/login';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

