import './App.css';
import Snowfall from 'react-snowfall';
import { RunZapret, WindowControls } from './widgets';
import { useTheme } from './shared/hooks/useTheme';
import { useAppInitialization } from './shared/hooks/useAppInitialization';
import { usePreventZoom } from './shared/hooks/usePreventZoom';
import { useBat } from './shared/hooks/useBat';

function App() {
    const { theme } = useTheme()
    const { batRunning } = useBat()
    const { isInitialized } = useAppInitialization()
    usePreventZoom()

    if (!isInitialized) {
        return null;
    }

    return (
        <div id="App">
            <Snowfall color={theme === 'light' && !batRunning ? '#aaa' : '#ededed'} />
            <WindowControls />
            <RunZapret />
        </div>
    )
}

export default App
