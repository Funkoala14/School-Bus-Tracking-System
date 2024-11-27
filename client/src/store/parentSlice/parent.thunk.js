import { createAsyncThunk } from "@reduxjs/toolkit";
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


// 获取家长列表
export const fetchParents = createAsyncThunk(
  'parent/fetchParents',
  async (_, { rejectWithValue, dispatch }) => {
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
  }
);

// 添加家长
export const addParent = createAsyncThunk(
  'parent/addParent',
  async (parentData, { rejectWithValue, dispatch }) => {
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
  }
);

// 更新家长信息
export const updateParent = createAsyncThunk(
  'parent/updateParent',
  async (parentData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await put(`/admin/parents/${parentData._id}`, parentData);
      dispatch(
        showNotification({
          message: 'Parent updated successfully',
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
export const deleteParent = createAsyncThunk(
  'parent/deleteParent',
  async (parentId, { rejectWithValue, dispatch }) => {
    try {
      await del(`/admin/parents/${parentId}`);
      dispatch(
        showNotification({
          message: 'Parent deleted successfully',
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
  }
);