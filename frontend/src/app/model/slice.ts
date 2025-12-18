import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    batRunning: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setBatRunning: (state, action) => {
            state.batRunning = action.payload;
        },
    },
});

export const { setBatRunning } = appSlice.actions;

export default appSlice.reducer;

export const selectBatRunning = (state: any): boolean =>
    state.app.batRunning;