import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    batRunning: false,
    soundSwitch: true,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setBatRunning: (state, action) => {
            state.batRunning = action.payload;
        },
        setSoundSwitch: (state) => {
            state.soundSwitch = !state.soundSwitch
        }
    },
});

export const { 
    setBatRunning,
    setSoundSwitch, 
} = appSlice.actions;

export default appSlice.reducer;

export const selectBatRunning = (state: any): boolean => state.app.batRunning;
export const selectSoundSwitch = (state: any): boolean => state.app.soundSwitch;