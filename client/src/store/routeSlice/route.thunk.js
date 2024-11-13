import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../../services/api';

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
