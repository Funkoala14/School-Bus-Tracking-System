import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post } from '../../services/api';

export const studentListThunk = createAsyncThunk('admin/students', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/admin/students');
        const { list } = data;
        return list;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Fetch students list failed';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

export const updateStudentInfoThunk = createAsyncThunk('admin/update-student', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/admin/update-student', config);
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'update students info failed';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

export const addStudentThunk = createAsyncThunk('admin/add-students', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/admin/add-students', config);
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'update students info failed';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});