import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../services/api';

export const getDriverListThunk = createAsyncThunk('/admin/drivers', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/admin/drivers');
        const { list } = data;
        return list;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

export const getDriverInfo = createAsyncThunk('/driver/info', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/driver/info');
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

export const updateDriverProfile = createAsyncThunk('/driver/update', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/driver/update', config);
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});
