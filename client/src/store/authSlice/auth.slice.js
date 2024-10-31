import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, logoutThunk } from './auth.thunk';

const setPending = (state) => {
    state.loading = true;
    state.userId = null;
    state.userName = '';
    state.role = '';
    state.isLoggedIn = false;
};

const setFulfilled = (state, action) => {
    const { userId, userName, role } = action.payload;
    state.userId = userId;
    state.userName = userName;
    state.role = role;
    state.isLoggedIn = true;

    state.loading = false;
};

const setRejected = (state, action) => {
    state.userId = null;
    state.userName = '';
    state.role = '';
    state.isLoggedIn = false;
    state.loading = false;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        userName: '',
        role: '',
        isLoggedIn: false,
        loading: false,
    },
    reducers: {
        setLoginData: (state, action) => {
            const { userId, userName, role } = action.payload;
            state.userId = userId;
            state.userName = userName;
            state.role = role;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.userId = null;
            state.userName = '';
            state.role = '';
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, setPending)
            .addCase(loginThunk.fulfilled, setFulfilled)
            .addCase(loginThunk.rejected, setRejected)

            .addCase(logoutThunk.fulfilled, setRejected);
    },
});

export const { setLoginData, logout } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
