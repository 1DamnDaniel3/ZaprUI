import { configureStore } from '@reduxjs/toolkit';
import chosenBatReducer from '../entities/BatCard/model/slice';

export const store = configureStore({
    reducer: {
        chosenBat: chosenBatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;