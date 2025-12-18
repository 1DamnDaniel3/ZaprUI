import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import MaximizeIcon from '../../assets/icons/maximize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';

import { CloseWindow, MinimizeWindow } from '../../../../wailsjs/go/main/App';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';


export function WindowControlButton({ type }: { type: 'minimize' | 'maximize' | 'close' }) {
    const batRunning = useSelector(selectBatRunning);

    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow();
        } else if (type === 'maximize') {
            // await MaximizeWindow();
        } else if (type === 'close') {
            await CloseWindow();
        }
    }

    const iconStyle = {
        color: batRunning ? 'var(--color-primary-dark)' : undefined,
    }

    return (
        <button className={s.button} onClick={handleClick}>
            {type === 'minimize' && <MinimizeIcon className={s.icon} style={iconStyle} />}
            {type === 'maximize' && <MaximizeIcon className={s.icon} style={iconStyle} />}
            {type === 'close' && <CloseIcon className={s.icon} style={iconStyle} />}
        </button>
    )
}