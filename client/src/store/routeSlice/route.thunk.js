import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../services/api';
import { showNotification } from '../../store/notificationSlice/notification.slice';

export const allRoutesThunk = createAsyncThunk('/route/all', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/route/all');
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

export const getDriverRoutes = createAsyncThunk('/driver/routes', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/driver/routes');
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

export const generateNewScheduleThunk = createAsyncThunk('/admin/generate-schedule', async (routeId, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/admin/generate-schedule', { routeId });
        console.log('generateSchedule: ', data);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const routeAddStopThunk = createAsyncThunk('/route/add-stop', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/add-stop', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const updateStopThunk = createAsyncThunk('/route/update-stop', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/update-stop', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const updateStopsThunk = createAsyncThunk('/route/update-stops', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/update-stops', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const deleteStopThunk = createAsyncThunk('/route/delete-stop', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/delete-stop', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const updateRouteInfoThunk = createAsyncThunk('/route/update', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/update', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const deleteRouteThunk = createAsyncThunk('/route/delete', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/delete', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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

export const addNewRouteThunk = createAsyncThunk('/route/add', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/route/add', config);
        dispatch(
            showNotification({
                message: message,
                severity: 'success',
            })
        );
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