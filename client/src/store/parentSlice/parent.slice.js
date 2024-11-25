import { createSlice } from '@reduxjs/toolkit';
<<<<<<< Updated upstream
import { getChildInfoThunk, getParentProfileThunk } from './parent.thunk.js';

const setPending = (state) => {
    state.loading = true;
};

const setFulfilled = (state, action) => {
    state.loading = false;
=======
import { fetchParents, addParent, updateParent, deleteParent } from './parent.thunk';

const setPending = (state) => {
    state.loading = true;
    state.error = null;
};

const setFulfilled = (state) => {
    state.loading = false;
    state.error = null;
>>>>>>> Stashed changes
};

const setRejected = (state, action) => {
    state.loading = false;
<<<<<<< Updated upstream
=======
    state.error = action.payload;
>>>>>>> Stashed changes
};

const parentSlice = createSlice({
    name: 'parent',
    initialState: {
<<<<<<< Updated upstream
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
=======
        parentList: [], // 存储家长列表
        selectedParent: null, // 当前选中的家长
        loading: false, // 是否加载中
        error: null, // 错误信息
    },
    reducers: {
        // 选择家长
        selectParent: (state, action) => {
            state.selectedParent = action.payload;
        },
        // 清空选择
        clearParent: (state) => {
            state.selectedParent = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 获取家长列表
            .addCase(fetchParents.pending, setPending)
            .addCase(fetchParents.fulfilled, (state, action) => {
                state.parentList = action.payload;
                setFulfilled(state);
            })
            .addCase(fetchParents.rejected, setRejected)

            // 添加家长
            .addCase(addParent.pending, setPending)
            .addCase(addParent.fulfilled, (state, action) => {
                state.parentList.push(action.payload);
                setFulfilled(state);
            })
            .addCase(addParent.rejected, setRejected)

            // 更新家长信息
            .addCase(updateParent.pending, setPending)
            .addCase(updateParent.fulfilled, (state, action) => {
                const index = state.parentList.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.parentList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(updateParent.rejected, setRejected)

            // 删除家长
            .addCase(deleteParent.pending, setPending)
            .addCase(deleteParent.fulfilled, (state, action) => {
                state.parentList = state.parentList.filter((p) => p._id !== action.payload);
                setFulfilled(state);
            })
            .addCase(deleteParent.rejected, setRejected);
    },
});

export const { selectParent, clearParent } = parentSlice.actions;
const parentReducer = parentSlice.reducer;
export default parentReducer;
>>>>>>> Stashed changes
