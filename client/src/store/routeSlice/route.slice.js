import { createSlice } from '@reduxjs/toolkit';
import { allRoutesThunk } from './route.thunk';

const setPending = (state) => {
    state.loading = true;
};

const setFulfilled = (state, action) => {
    state.loading = false;
};

const setRejected = (state, action) => {
    state.loading = false;
};

const routeSlice = createSlice({
    name: 'route',
    initialState: {
        routes: [],
        selectedRoute: null,
        loading: false,
        nextStopData: null,
    },
    reducers: {
        selectRoute: (state, action) => {
            state.selectedRoute = action.payload;
        },
        clearRoute: (state, action) => {
            state.selectedRoute = null;
        },
        setNextStopData: (state, action) => {
            state.nextStopData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(allRoutesThunk.pending, setPending)
            .addCase(allRoutesThunk.fulfilled, (state, action) => {
                state.routes = action.payload;
                state.loading = false;
            })
            .addCase(allRoutesThunk.rejected, setRejected);
    },
});

export const { selectRoute, clearRoute, setNextStopData } = routeSlice.actions;

const routeReducer = routeSlice.reducer;
export default routeReducer;
