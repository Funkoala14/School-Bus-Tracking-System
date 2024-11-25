import { createSlice } from '@reduxjs/toolkit';
import { getChildInfoThunk, getParentProfileThunk } from './parent.thunk.js';

const setPending = (state) => {
    state.loading = true;
};

const setFulfilled = (state, action) => {
    state.loading = false;
};

const setRejected = (state, action) => {
    state.loading = false;
};

const parentSlice = createSlice({
    name: 'parent',
    initialState: {
        profile: null,
        childInfo: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getChildInfoThunk.pending, setPending)
            .addCase(getChildInfoThunk.fulfilled, (state, action) => {
                state.childInfo = action.payload;
                state.loading = false;
            })
            .addCase(getChildInfoThunk.rejected, setRejected)
            .addCase(getParentProfileThunk.pending, setPending)
            .addCase(getParentProfileThunk.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addCase(getParentProfileThunk.rejected, setRejected);
    },
});

const parentReuducer = parentSlice.reducer;
export default parentReuducer;
