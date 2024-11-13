import { createSlice } from '@reduxjs/toolkit';
import { studentListThunk } from './admin.thunk';

const setPending = (state) => {
    state.loading = true;
};

const setFulfilled = (state, action) => {
    state.loading = false;
};

const setRejected = (state, action) => {
    state.loading = false;
};

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        studentList: [],
        selectStudent: null,
        loading: false,
    },
    reducers: {
        selectStudent: (state, action) => {
            state.selectStudent = action.payload;
        },
        clearStuden: (state, action) => {
            state.selectStudent = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(studentListThunk.pending, setPending)
            .addCase(studentListThunk.fulfilled, (state, action) => {
                state.studentList = action.payload;
                state.loading = false;
            })
            .addCase(studentListThunk.rejected, setRejected);
    },
});

export const { selectStudent, clearStuden } = adminSlice.actions;
const adminReducer = adminSlice.reducer;
export default adminReducer;
