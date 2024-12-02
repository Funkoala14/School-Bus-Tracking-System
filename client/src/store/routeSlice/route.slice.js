import { createSlice } from '@reduxjs/toolkit';
import {
    addNewRouteThunk,
    allRoutesThunk,
    deleteRouteThunk,
    deleteStopThunk,
    generateNewScheduleThunk,
    routeAddStopThunk,
    updateStopsThunk,
    updateStopThunk,
} from './route.thunk';

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
        clearError: () => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(allRoutesThunk.pending, setPending)
            .addCase(allRoutesThunk.fulfilled, (state, action) => {
                state.routes = action.payload;
                state.loading = false;
            })
            .addCase(allRoutesThunk.rejected, setRejected)

            .addCase(generateNewScheduleThunk.pending, setPending)
            .addCase(generateNewScheduleThunk.fulfilled, (state, action) => {
                const index = state.routes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.routes[index] = action.payload; // Update the route data
                }
                state.loading = false;
            })
            .addCase(generateNewScheduleThunk.rejected, setRejected)

            .addCase(routeAddStopThunk.pending, setPending)
            .addCase(routeAddStopThunk.fulfilled, (state, action) => {
                const index = state.routes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.routes[index] = action.payload; // Update the route data
                }
                state.loading = false;
            })
            .addCase(routeAddStopThunk.rejected, setRejected)

            .addCase(updateStopThunk.pending, setPending)
            .addCase(updateStopThunk.fulfilled, (state, action) => {
                const index = state.routes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.routes[index] = action.payload; // Update the route data
                }
                state.loading = false;
            })
            .addCase(updateStopThunk.rejected, setRejected)

            .addCase(updateStopsThunk.pending, setPending)
            .addCase(updateStopsThunk.fulfilled, (state, action) => {
                const index = state.routes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.routes[index] = action.payload; // Update the route data
                }
                state.loading = false;
            })
            .addCase(updateStopsThunk.rejected, setRejected)

            .addCase(deleteStopThunk.pending, setPending)
            .addCase(deleteStopThunk.fulfilled, (state, action) => {
                const index = state.routes.findIndex((r) => r._id === action.payload._id);
                if (index !== -1) {
                    state.routes[index] = action.payload; // Update the route data
                }
                state.loading = false;
            })
            .addCase(deleteStopThunk.rejected, setRejected)

            .addCase(deleteRouteThunk.pending, setPending)
            .addCase(deleteRouteThunk.fulfilled, (state, action) => {
                state.routes = action.payload;
                state.loading = false;
            })
            .addCase(deleteRouteThunk.rejected, setRejected)

            .addCase(addNewRouteThunk.pending, setPending)
            .addCase(addNewRouteThunk.fulfilled, (state, action) => {
                state.routes = action.payload;
                state.loading = false;
            })
            .addCase(addNewRouteThunk.rejected, setRejected);
    },
});

export const { selectRoute, clearRoute, setNextStopData } = routeSlice.actions;

const routeReducer = routeSlice.reducer;
export default routeReducer;
