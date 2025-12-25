import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';
import InfoIcon from '../../assets/icons/information.svg?react';
import SoundOn from '../../assets/icons/sound-on.svg?react';
import SoundOff from '../../assets/icons/sound-off.svg?react';

import selectSound from '../../assets/sounds/select.mp3'
import backSound from '../../assets/sounds/back.mp3'

import { WindowHide, MinimizeWindow } from '../../../../wailsjs/go/main/App';
import { useDispatch, useSelector } from 'react-redux';
import { selectBatRunning, selectSoundSwitch, setSoundSwitch } from '../../../app/model/slice';
import { useState } from 'react';

import { InfoModal } from './InfoModal/InfoModal';
import { playSound } from '../../lib/playSound';


export function WindowControlButton({ type }: { type: 'minimize' | 'close' | 'info' | 'sound' }) {
    const batRunning = useSelector(selectBatRunning);
    const soundState = useSelector(selectSoundSwitch);

    const dispatch = useDispatch()

    const [infoOpen, setInfoOpen] = useState<boolean>(false)
    const [animateClose, setAnimateClose] = useState<boolean>(false)

    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow();
            playSound(backSound, 0.2, soundState)
        } else if (type === 'close') {
            await WindowHide();
            playSound(backSound, 0.2, soundState)
        } else if (type === 'info') {
            if (!infoOpen) {
                setInfoOpen(true)
                setAnimateClose(false)
                playSound(selectSound, 0.2, soundState)
            }
            else {
                setAnimateClose(true)
                playSound(backSound, 0.2, soundState)
                setTimeout(() => {
                    setInfoOpen(false)
                }, 180)
            }
        } else if (type === 'sound') {
            if (soundState) dispatch(setSoundSwitch(false))
            else dispatch(setSoundSwitch(true))
            playSound(backSound, 0.2, soundState)
        }
    }

    const iconStyle = {
        color: batRunning ? 'var(--color-primary-dark)' : undefined,
    }

    return (
        <button className={s.button} onClick={handleClick}>
            {type === 'minimize' && <MinimizeIcon className={s.icon} style={iconStyle} />}
            {type === 'close' && <CloseIcon className={s.icon} style={iconStyle} />}
            {type === 'info' && <InfoIcon className={s.icon} style={iconStyle} />}
            {type === 'sound' && soundState && <SoundOn className={s.icon} style={iconStyle} />}
            {type === 'sound' && !soundState && <SoundOff className={s.icon} style={iconStyle} />}

            {type === 'info' && infoOpen && <InfoModal animateClose={animateClose} />}
        </button>
    )
}