import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';
import InfoIcon from '../../assets/icons/information.svg?react';
import SoundOn from '../../assets/icons/sound-on.svg?react';
import SoundOff from '../../assets/icons/sound-off.svg?react';
import ThemeLight from '../../assets/icons/light-mode.svg?react';
import ThemeDark from '../../assets/icons/dark-mode.svg?react';
import { WindowHide, MinimizeWindow } from '../../../../wailsjs/go/main/App';
import { useState } from 'react';

import { InfoModal } from './InfoModal/InfoModal';
import { useTheme } from '../../hooks/useTheme';
import { useBat } from '../../hooks/useBat';
import { useSound } from '../../hooks/useSound';

type WindowControlButtonType = 'minimize' | 'close' | 'info' | 'sound' | 'theme';

interface WindowControlButtonProps {
    type: WindowControlButtonType;
}

export function WindowControlButton({ type }: WindowControlButtonProps) {
    const { soundState, toggleSound, play } = useSound()
    const { theme, toggleTheme } = useTheme()
    const { batRunning } = useBat()

    const [infoOpen, setInfoOpen] = useState<boolean>(false)
    const [animateClose, setAnimateClose] = useState<boolean>(false)

    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow();
            play('back')
        } else if (type === 'close') {
            await WindowHide();
            play('back')
        } else if (type === 'info') {
            if (!infoOpen) {
                setInfoOpen(true)
                setAnimateClose(false)
                play('select')
            }
            else {
                setAnimateClose(true)
                play('back')
                setTimeout(() => {
                    setInfoOpen(false)
                }, 180)
            }
        } else if (type === 'sound') {
            toggleSound()
            play('back')
        } else if (type === 'theme') {
            if (theme === 'light') {
                play('back')
            }
            else {
                play('select')
            }
            toggleTheme()
        }
    }

    const iconStyle = {
        color: batRunning ? 'var(--color-accent)' : undefined,
    }

    return (
        <button className={`${s.button}`} onClick={handleClick} onMouseEnter={() => play('hover')}>
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