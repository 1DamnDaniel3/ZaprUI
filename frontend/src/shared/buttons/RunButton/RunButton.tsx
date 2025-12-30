import s from './RunButton.module.scss';
import AppIcon from '../../../../../build/windows/icon.ico';
import { useState } from 'react';
import { useBat } from '../../hooks/useBat';
import { useSound } from '../../hooks/useSound';

interface RunButtonProps {
    title: string,
    onClick: () => void,
    isActive?: boolean
}

export function RunButton({ onClick }: RunButtonProps) {
    const [animate, setAnimate] = useState(false)

    const { batRunning } = useBat()
    const { play } = useSound()

    const handleClick = () => {
        play(batRunning ? 'back' : 'select')
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`} onClick={handleClick}>
            <button className={`${s.btn} ${batRunning ? s.running : ''}`} onClick={onClick}>
                <div className={`${s.top} ${batRunning ? s.running : ''}`}>
                    <img src={AppIcon} className={`${s.icon} ${batRunning ? s.running : ''}`} alt="Run Icon" />
                </div>
            </button>
        </div>
    );
}