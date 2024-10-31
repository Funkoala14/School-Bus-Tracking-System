import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        userName: '',
        role: '',
        isLoggedIn: false
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
        }
    }
});

export const { setLoginData, logout } = authSlice.actions;
export default authSlice.reducer;
