import { createSlice } from '@reduxjs/toolkit';
import { WriteFile } from '../../../wailsjs/go/main/App';

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
        setSoundSwitch: (state, action) => {
            state.soundSwitch = action.payload
            WriteFile('soundProperties.json', { soundState: action.payload })
        },
    },
});

export const { 
    setBatRunning,
    setSoundSwitch, 
} = appSlice.actions;

export default appSlice.reducer;

export const selectBatRunning = (state: any): boolean => state.app.batRunning;
export const selectSoundSwitch = (state: any): boolean => state.app.soundSwitch;