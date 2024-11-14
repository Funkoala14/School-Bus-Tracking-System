import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    title: 'Home',
    ifBack: false,
};

const titleSlice = createSlice({
    name: 'title',
    initialState,
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload.title;
            state.ifBack = action.payload.ifBack;
        },
    },
});

export const { setTitle } = titleSlice.actions;
const titleReducer = titleSlice.reducer;
export default titleReducer;
