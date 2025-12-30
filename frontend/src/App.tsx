import './App.css';
import Snowfall from 'react-snowfall';
import { RunZapret, WindowControls } from './widgets';
import { useTheme } from './shared/hooks/useTheme';
import { useAppInitialization } from './shared/hooks/useAppInitialization';
import { usePreventZoom } from './shared/hooks/usePreventZoom';

function App() {
    const { theme } = useTheme()
    const { isInitialized } = useAppInitialization()
    usePreventZoom()

    if (!isInitialized) {
        return null;
    }

    return (
        <div id="App">
            <Snowfall color={theme === 'light' ? '#aaa' : '#ededed'} />
            <WindowControls />
            <RunZapret />
        </div>
    )
}

export default App
