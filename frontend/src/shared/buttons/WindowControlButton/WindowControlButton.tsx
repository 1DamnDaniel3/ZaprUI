import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import MaximizeIcon from '../../assets/icons/maximize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';

import { CloseWindow, MinimizeWindow } from '../../../../wailsjs/go/main/App';


export function WindowControlButton({ type }: { type: 'minimize' | 'maximize' | 'close' }) {
    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow({});
        } else if (type === 'maximize') {
            // await MaximizeWindow({});
        } else if (type === 'close') {
            await app.CloseWindow({});
        }
    }

    return (
        <button className={s.button} onClick={handleClick}>
            {type === 'minimize' && <MinimizeIcon className={s.icon} />}
            {type === 'maximize' && <MaximizeIcon className={s.icon} />}
            {type === 'close' && <CloseIcon className={s.icon} />}
        </button>
    )
}