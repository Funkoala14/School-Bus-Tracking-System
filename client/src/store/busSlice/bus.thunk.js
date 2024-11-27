import { createAsyncThunk } from '@reduxjs/toolkit';
import { get, post, put, del } from '../../services/api'; // 假设服务文件中包含这些方法
import { showNotification } from '../notificationSlice/notification.slice';

// 获取巴士列表
export const fetchBuses = createAsyncThunk(
  'bus/fetchBuses',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await get('/bus/all');
      const { list } = data;
      return list;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch bus list';
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

// 添加巴士
export const addBus = createAsyncThunk(
  'bus/addBus',
  async (busData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await post('/admin/buses', busData);
      dispatch(
        showNotification({
          message: 'Bus added successfully',
          severity: 'success',
        })
      );
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add bus';
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

// 更新巴士信息
export const updateBus = createAsyncThunk(
  'bus/updateBus',
  async (busData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await put(`/admin/buses/${busData._id}`, busData);
      dispatch(
        showNotification({
          message: 'Bus updated successfully',
          severity: 'success',
        })
      );
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update bus';
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

// 删除巴士
export const deleteBus = createAsyncThunk(
  'bus/deleteBus',
  async (busId, { rejectWithValue, dispatch }) => {
    try {
      await del(`/admin/buses/${busId}`);
      dispatch(
        showNotification({
          message: 'Bus deleted successfully',
          severity: 'success',
        })
      );
      return busId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete bus';
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
