import "./App.css";
import Snowfall from "react-snowfall";
import { RunZapret, WindowControls } from "./widgets";
import { useTheme } from "./shared/hooks/useTheme";
import { useAppInitialization } from "./shared/hooks/useAppInitialization";
import { usePreventZoom } from "./shared/hooks/usePreventZoom";
import { useBat } from "./shared/hooks/useBat";
import { leaves } from "./shared/assets/images";
import { sakura } from "./shared/assets/images";
import { useEffect, useState } from "react";

function App() {
    const { theme } = useTheme();
    const { batRunning } = useBat();
    const { isInitialized } = useAppInitialization();
    usePreventZoom();

    const now = new Date();
    const month = now.getMonth(); // 0 = январь, 11 = декабрь
    const isWinter: boolean = month === 11 || month === 0 || month === 1;
    const isSpring: boolean = month >= 2 && month <= 4;
    const isSummer: boolean = month >= 5 && month <= 7;
    const isAutumn: boolean = month >= 8 && month <= 10;

    const [leafImages, setLeafImages] = useState<HTMLImageElement[]>([]);

    let images,
        radius = [0.5, 3.0],
        snowflakeCount;

    if (isSpring) {
        images = leafImages;
        radius = [20, 28];
        snowflakeCount = 32;
    } else if (isSummer) {
        radius = [32, 40];
        snowflakeCount = 16;
    } else if (isAutumn) {
        images = leafImages;
        radius = [20, 28];
        snowflakeCount = 16;
    } else if (isWinter) {
        radius = [0.5, 3.0];
        snowflakeCount = 150;
    }

    useEffect(() => {
        let particles;
        if (isSpring) {
            particles = sakura;
        } else if (isAutumn) {
            particles = leaves;
        }
        if (!particles) return;
        const images = particles.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });
        setLeafImages(images);
    }, []);

    if (!isInitialized) {
        return null;
    }

    return (
        <div id="App">
            {!isSummer && (
                <Snowfall
                    color={
                        theme === "light" && !batRunning ? "#aaa" : "#ededed"
                    }
                    images={images}
                    radius={[radius[0], radius[1]]}
                    snowflakeCount={snowflakeCount}
                />
            )}

            <WindowControls />
            <RunZapret />
        </div>
    );
}

export default App;
