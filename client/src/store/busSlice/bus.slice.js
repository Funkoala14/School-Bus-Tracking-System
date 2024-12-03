import { createSlice } from '@reduxjs/toolkit';
import { fetchBuses, addBusThunk, updateBusThunk, deleteBusThunk } from './bus.thunk';

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
            .addCase(addBusThunk.pending, setPending)
            .addCase(addBusThunk.fulfilled, (state, action) => {
                state.busList = action.payload;
                setFulfilled(state);
            })
            .addCase(addBusThunk.rejected, setRejected)

            .addCase(updateBusThunk.pending, setPending)
            .addCase(updateBusThunk.fulfilled, (state, action) => {
                const index = state.busList.findIndex((bus) => bus._id === action.payload._id);
                if (index !== -1) {
                    state.busList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(updateBusThunk.rejected, setRejected)

            .addCase(deleteBusThunk.pending, setPending)
            .addCase(deleteBusThunk.fulfilled, (state, action) => {
                state.busList = action.payload;
                setFulfilled(state);
            })
            .addCase(deleteBusThunk.rejected, setRejected);
    },
});

export const { selectBus, clearBus } = busSlice.actions;
const busReducer = busSlice.reducer;
export default busReducer;
