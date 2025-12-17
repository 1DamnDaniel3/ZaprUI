import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../app/store';
import { BatFile } from './interfaces';

let initialState = {
    chosenBat: {id: -1, path: ''},
    batFiles: [] as {id: number, path: string}[]
}

const chosenBatSlice = createSlice({
    name: 'chosenBat',
    initialState,
    reducers: {
        setChosenBat: (state, action) => {
            state.chosenBat = action.payload;
        },
        setBatFiles: (state, action) => {
            const payloadList = action.payload as BatFile[];
            state.batFiles = payloadList.filter((item) => {
                return !item.path.split('\\').pop()?.includes('service');
            })
        }
    }
});

export const { 
    setChosenBat,
    setBatFiles
 } = chosenBatSlice.actions;

export default chosenBatSlice.reducer;


export const selectChosenBat = (state: RootState) =>
    state.chosenBat.chosenBat;

export const selectBatFiles = (state: RootState): BatFile[] =>
    state.chosenBat.batFiles;