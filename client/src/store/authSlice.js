import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { data } = action.payload;
            state.user = data;
        }
    }
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;