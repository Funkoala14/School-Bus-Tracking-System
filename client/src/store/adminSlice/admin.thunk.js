import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api';

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
