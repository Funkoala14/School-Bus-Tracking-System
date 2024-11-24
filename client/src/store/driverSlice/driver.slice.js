import { createSlice } from '@reduxjs/toolkit';
import { getDriverInfo } from './driver.thunk';

const setPending = (state) => {
    state.loading = true;
};

const setFulfilled = (state, action) => {
    state.loading = false;
};

const setRejected = (state, action) => {
    state.loading = false;
};

const driverSlice = createSlice({
    name: 'driver',
    initialState: {
        info: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDriverInfo.pending, setPending)
            .addCase(getDriverInfo.fulfilled, (state, action) => {
                state.info = action.payload;
                state.loading = false;
            })
            .addCase(getDriverInfo.rejected, setRejected);
    },
});

const driverReducer = driverSlice.reducer;
export default driverReducer;
