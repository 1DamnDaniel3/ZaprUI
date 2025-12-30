import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import { RunZapret, WindowControls } from './widgets';
import { useDispatch, useSelector } from 'react-redux';
import { ReadFile } from '../wailsjs/go/main/App';
import { setChosenBat } from './entities/BatCard/model/slice';
import { selectTheme, setSoundSwitch, setTheme } from './app/model/slice';
import Snowfall from 'react-snowfall';

function App() {
    const dispatch = useDispatch()
    const [isInitialized, setIsInitialized] = useState(false)
    const theme = useSelector(selectTheme)

    useLayoutEffect(() => {
        // Убираем transition перед установкой темы
        document.documentElement.classList.add('no-transition')

        Promise.all([
            ReadFile('batProperties.json')
                .then((data) => {
                    if (data.hasOwnProperty('chosenBat')) dispatch(setChosenBat(data.chosenBat))
                }),
            ReadFile('soundProperties.json')
                .then((data) => {
                    if (data.hasOwnProperty('soundState')) dispatch(setSoundSwitch(data.soundState))
                }),
            ReadFile('themeProperties.json')
                .then((data) => {
                    if (data.hasOwnProperty('theme')) {
                        dispatch(setTheme(data.theme))
                        document.documentElement.setAttribute('data-theme', data.theme)
                    }
                })
        ]).then(() => {
            // Восстанавливаем transition после небольшой задержки
            setTimeout(() => {
                document.documentElement.classList.remove('no-transition')
                setIsInitialized(true)
            }, 50)
        })
    }, [])

    useEffect(() => {
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
            <Snowfall color={theme === 'light' ? '#aaa' : '#ededed'}/>
            <WindowControls />
            <RunZapret />
        </div>
    )
}

export default App
