import { createSlice } from '@reduxjs/toolkit';
import { WriteFile } from '../../../wailsjs/go/main/App';
import { WarningInterface } from '../../shared/interfaces/interfaces';

interface InitialStateInterface {
    batRunning: boolean,
    soundSwitch: boolean,
    theme: string,
    warning: WarningInterface | null,
    criticalError: string,
}

let initialState: InitialStateInterface = {
    batRunning: false,
    soundSwitch: true,
    theme: 'light',
    warning: null,
    criticalError: '',
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
        setTheme: (state, action) => {
            state.theme = action.payload
            WriteFile('themeProperties.json', { theme: action.payload })
        },
        setWarning: (state, action) => {
            state.warning = action.payload
        },
        setCriticalError: (state, action) => {
            state.criticalError = action.payload
        }
    },
});

export const {
    setBatRunning,
    setSoundSwitch,
    setTheme,
    setWarning,
    setCriticalError
} = appSlice.actions;

export default appSlice.reducer;

export const selectBatRunning = (state: any): boolean => state.app.batRunning;
export const selectSoundSwitch = (state: any): boolean => state.app.soundSwitch;
export const selectTheme = (state: any): string => state.app.theme
export const selectWarning = (state: any): WarningInterface => state.app.warning
export const selectCriticalError = (state: any): string => state.app.criticalError