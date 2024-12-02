import { createSlice } from '@reduxjs/toolkit';
import {
    getChildInfoThunk,
    getParentProfileThunk,
    fetchParents,
    addParent,
    updateParent,
    deleteParent,
    addChildThunk,
    addChildByParentThunk,
    updateParentProfileThunk,
    removeChildThunk,
} from './parent.thunk.js';

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

const parentSlice = createSlice({
    name: 'parent',
    initialState: {
        parentList: [], // 存储家长列表
        selectedParent: null, // 当前选中的家长
        profile: null,
        childInfo: null,
        loading: false,
        error: null, // 错误信息
    },
    reducers: {
        // 选择家长
        selectParent: (state, action) => {
            state.selectedParent = action.payload;
        },
        // 清空选择
        clearParent: (state) => {
            state.loading = false;
            state.selectedParent = null;
        },
        clearError: (state) => {
            state.loading = false;
            state.error = null;
        },
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
            .addCase(getParentProfileThunk.rejected, setRejected)

            .addCase(updateParentProfileThunk.pending, setPending)
            .addCase(updateParentProfileThunk.fulfilled, (state, action) => {
                state.profile = action.payload;
                setFulfilled(state);
            })
            .addCase(updateParentProfileThunk.rejected, setRejected)

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
            .addCase(deleteParent.rejected, setRejected)

            // parent add child (admin)
            .addCase(addChildThunk.pending, setPending)
            .addCase(addChildThunk.fulfilled, (state, action) => {
                const index = state.parentList.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.parentList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(addChildThunk.rejected, setRejected)

            // parent add child (parent)
            .addCase(addChildByParentThunk.pending, setPending)
            .addCase(addChildByParentThunk.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.childInfo = action.payload.children;
                setFulfilled(state);
            })
            .addCase(addChildByParentThunk.rejected, setRejected)

            .addCase(removeChildThunk.pending, setPending)
            .addCase(removeChildThunk.fulfilled, (state, action) => {
                const index = state.parentList.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) {
                    state.parentList[index] = action.payload;
                }
                setFulfilled(state);
            })
            .addCase(removeChildThunk.rejected, setRejected);
    },
});

export const { selectParent, clearParent, clearError } = parentSlice.actions;
const parentReducer = parentSlice.reducer;
export default parentReducer;
