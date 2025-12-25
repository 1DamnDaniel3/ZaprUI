import { useEffect, useState } from 'react';
import './App.css';
import { RunZapret, WindowControls } from './widgets';
import { useDispatch } from 'react-redux';
import { ReadFile } from '../wailsjs/go/main/App';
import { setChosenBat } from './entities/BatCard/model/slice';
import { setSoundSwitch } from './app/model/slice';

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        ReadFile('batProperties.json')
            .then((data) => {
                if (data.hasOwnProperty('chosenBat')) dispatch(setChosenBat(data.chosenBat))
            })
        ReadFile('soundProperties.json')
            .then((data) => {
                if (data.hasOwnProperty('soundState')) dispatch(setSoundSwitch(data.soundState))
            })

        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) {
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <div id="App">
            <WindowControls />
            <RunZapret />
        </div>
    )
}

export default App
