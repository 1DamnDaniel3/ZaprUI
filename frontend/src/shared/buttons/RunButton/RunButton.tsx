import s from './RunButton.module.scss';
import AppIcon from '../../../../../build/windows/icon.ico';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectBatRunning, selectSoundSwitch, selectTheme } from '../../../app/model/slice';
import { playSound } from '../../lib/playSound';
import selectSound from '../../assets/sounds/select.mp3'
import backSound from '../../assets/sounds/back.mp3'

export function RunButton({ onClick }: { title: string, onClick: () => void, isActive?: boolean }) {
    const [animate, setAnimate] = useState(false)

    const batRunning = useSelector(selectBatRunning);
    const soundState = useSelector(selectSoundSwitch)

    const handleClick = () => {
        playSound(batRunning ? backSound : selectSound, 0.1, soundState)
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