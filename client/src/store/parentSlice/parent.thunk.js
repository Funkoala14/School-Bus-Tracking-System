import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put, del } from '../../services/api'; // 假设服务文件提供了 HTTP 方法
import { showNotification } from '../notificationSlice/notification.slice';

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

export const updateParentProfileThunk = createAsyncThunk('/parent/update', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/parent/update', config);
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


// 获取家长列表
export const fetchParents = createAsyncThunk('parent/fetchParents', async (_, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await get('/admin/parents');
        const { list } = data;
        return list;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch parents list';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

// 添加家长
export const addParent = createAsyncThunk('parent/addParent', async (parentData, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await post('/admin/parents', parentData);
        dispatch(
            showNotification({
                message: 'Parent added successfully',
                severity: 'success',
            })
        );
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to add parent';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

// 更新家长信息
export const updateParent = createAsyncThunk(
    'parent/updateParent',
    async (config, { rejectWithValue, dispatch }) => {
        try {
            const { data, message } = await post('/parent/update', config);
            dispatch(
                showNotification({
                    message: message,
                    severity: 'success',
                })
            );
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update parent';
            dispatch(
                showNotification({
                    message: errorMessage,
                    severity: 'error',
                })
            );
            return rejectWithValue(errorMessage);
        }
    }
);

// 删除家长
export const deleteParent = createAsyncThunk('parent/deleteParent', async (parentId, { rejectWithValue, dispatch }) => {
    try {
        const { message } = await post("/admin/delete-parent", { parentId });
        dispatch(
            showNotification({
                message,
                severity: 'success',
            })
        );
        return parentId;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete parent';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

// parent add child (admin)
export const addChildThunk = createAsyncThunk('admin/parent/add-child', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/admin/add-student', config);
        dispatch(showNotification({ message, severity: 'success' }));
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete parent';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

// parent add child (parent)
export const addChildByParentThunk = createAsyncThunk('parent/add-child', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/parent/add-student', config);
        dispatch(showNotification({ message, severity: 'success' }));
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete parent';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});

// parent remove child
export const removeChildThunk = createAsyncThunk('parent/remove-child', async (config, { rejectWithValue, dispatch }) => {
    try {
        const { data, message } = await post('/parent/remove-student', config);
        dispatch(showNotification({ message, severity: 'success' }));
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete parent';
        dispatch(
            showNotification({
                message: errorMessage,
                severity: 'error',
            })
        );
        return rejectWithValue(errorMessage);
    }
});
