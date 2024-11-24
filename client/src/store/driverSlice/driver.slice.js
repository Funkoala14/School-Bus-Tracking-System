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
        selectedRoute: null,
        loading: false,
    },
    reducers: {
        selectRoute: (state, action) => {
            console.log(action.payload);
            state.selectedRoute = action.payload;
        },
    },
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
export const { selectRoute } = driverSlice.actions;
const driverReducer = driverSlice.reducer;
export default driverReducer;
