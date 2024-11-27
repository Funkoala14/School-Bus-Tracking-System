import { createSlice } from '@reduxjs/toolkit';
import { fetchBuses, addBus, updateBus, deleteBus } from './bus.thunk';

const setPending = (state) => {
    state.loading = true;
    state.error = null;
};

const setFulfilled = (state) => {
    state.loading = false;
    state.error = null;
};

const setRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload;
};

const busSlice = createSlice({
    name: 'bus',
    initialState: {
        busList: [], // 存储所有巴士数据
        selectedBus: null, // 当前选中的巴士
        loading: false, // 加载状态
        error: null, // 错误信息
    },
    reducers: {
        selectBus: (state, action) => {
            state.selectedBus = action.payload;
        },
        clearBus: (state) => {
            state.selectedBus = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuses.pending, setPending)
            .addCase(fetchBuses.fulfilled, (state, action) => {
                state.busList = action.payload;
                setFulfilled(state);
            })
            .addCase(fetchBuses.rejected, setRejected)
            .addCase(addBus.pending, setPending)
            .addCase(addBus.fulfilled, (state, action) => {
                state.busList.push(action.payload);
                setFulfilled(state);
            })
            .addCase(addBus.rejected, setRejected)
            .addCase(updateBus.pending, setPending)
            .addCase(updateBus.fulfilled, (state, action) => {
                const index = state.busList.findIndex((bus) => bus._id === action.payload._id);
                if (index !== -1) {
                    state.busList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(updateBus.rejected, setRejected)
            .addCase(deleteBus.pending, setPending)
            .addCase(deleteBus.fulfilled, (state, action) => {
                state.busList = state.busList.filter((bus) => bus._id !== action.payload);
                setFulfilled(state);
            })
            .addCase(deleteBus.rejected, setRejected);
    },
});

export const { selectBus, clearBus } = busSlice.actions;
const busReducer = busSlice.reducer;
export default busReducer;
