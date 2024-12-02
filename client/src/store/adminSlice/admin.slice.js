import { createSlice } from '@reduxjs/toolkit';
import { addStudentThunk, studentListThunk, updateStudentInfoThunk } from './admin.thunk';

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
                setFulfilled(state);
            })
            .addCase(studentListThunk.rejected, setRejected)

            .addCase(addStudentThunk.pending, setPending)
            .addCase(addStudentThunk.fulfilled, (state, action) => {
                state.studentList = action.payload;
                setFulfilled(state);
            })
            .addCase(addStudentThunk.rejected, setRejected)

            .addCase(updateStudentInfoThunk.pending, setPending)
            .addCase(updateStudentInfoThunk.fulfilled, (state, action) => {
                const index = state.studentList.findIndex((s) => s._id === action.payload._id);
                if (index !== -1) {
                    state.studentList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(updateStudentInfoThunk.rejected, setRejected)
    },
});

export const { selectStudent, clearStuden } = adminSlice.actions;
const adminReducer = adminSlice.reducer;
export default adminReducer;
