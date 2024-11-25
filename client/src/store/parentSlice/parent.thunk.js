import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "../../services/api.js";

export const getChildInfoThunk = createAsyncThunk('/parent/children-info', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/parent/children-info');
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

export const getParentProfileThunk = createAsyncThunk('/parent/profile', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await get('/parent/profile');
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
