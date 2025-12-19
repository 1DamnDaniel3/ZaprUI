import { useEffect } from 'react';
import './App.css';
import { RunZapret, WindowControls } from './widgets';

function App() {

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
            <WindowControls />
            <RunZapret />
        </div>
    )
}

export default App
