import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';
import InfoIcon from '../../assets/icons/information.svg?react';
import SoundOn from '../../assets/icons/sound-on.svg?react';
import SoundOff from '../../assets/icons/sound-off.svg?react';
import ThemeLight from '../../assets/icons/light-mode.svg?react';
import ThemeDark from '../../assets/icons/dark-mode.svg?react';

import selectSound from '../../assets/sounds/select.mp3'
import backSound from '../../assets/sounds/back.mp3'
import menuSound from '../../assets/sounds/menu.mp3'

import { WindowHide, MinimizeWindow } from '../../../../wailsjs/go/main/App';
import { useDispatch, useSelector } from 'react-redux';
import { selectBatRunning, selectSoundSwitch, selectTheme, setSoundSwitch, setTheme } from '../../../app/model/slice';
import { useState } from 'react';

import { InfoModal } from './InfoModal/InfoModal';
import { playSound } from '../../lib/playSound';


export function WindowControlButton({ type }: { type: 'minimize' | 'close' | 'info' | 'sound' | 'theme' }) {
    const batRunning = useSelector(selectBatRunning);
    const soundState = useSelector(selectSoundSwitch);
    const theme = useSelector(selectTheme);

    const dispatch = useDispatch()

    const [infoOpen, setInfoOpen] = useState<boolean>(false)
    const [animateClose, setAnimateClose] = useState<boolean>(false)

    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow();
            playSound(backSound, 0.1, soundState)
        } else if (type === 'close') {
            await WindowHide();
            playSound(backSound, 0.1, soundState)
        } else if (type === 'info') {
            if (!infoOpen) {
                setInfoOpen(true)
                setAnimateClose(false)
                playSound(selectSound, 0.1, soundState)
            }
            else {
                setAnimateClose(true)
                playSound(backSound, 0.1, soundState)
                setTimeout(() => {
                    setInfoOpen(false)
                }, 180)
            }
        } else if (type === 'sound') {
            if (soundState) dispatch(setSoundSwitch(false))
            else dispatch(setSoundSwitch(true))
            playSound(backSound, 0.1, soundState)
        } else if (type === 'theme') {
            if (theme === 'light') {
                playSound(backSound, 0.1, soundState)
                dispatch(setTheme('dark'))
                document.documentElement.setAttribute('data-theme', 'dark')
            }
            else {
                playSound(selectSound, 0.1, soundState)
                dispatch(setTheme('light'))
                document.documentElement.setAttribute('data-theme', 'light')
            }
        }
    }

    const iconStyle = {
        color: batRunning ? 'var(--color-accent)' : undefined,
    }

    return (
        <button className={`${s.button}`} onClick={handleClick} onMouseEnter={() => playSound(menuSound, 0.05, soundState)}>
            {type === 'minimize' && <MinimizeIcon className={s.icon} style={iconStyle} />}
            {type === 'close' && <CloseIcon className={s.icon} style={iconStyle} />}
            {type === 'info' && <InfoIcon className={s.icon} style={iconStyle} />}
            {type === 'sound' && soundState && <SoundOn className={s.icon} style={iconStyle} />}
            {type === 'sound' && !soundState && <SoundOff className={s.icon} style={iconStyle} />}
            {type === 'theme' && theme === 'dark' && <ThemeDark className={s.icon} style={iconStyle} />}
            {type === 'theme' && theme === 'light' && <ThemeLight className={s.icon} style={iconStyle} />}

            {type === 'info' && infoOpen && <InfoModal animateClose={animateClose} />}
        </button>
    )
}