import s from './WindowControlButton.module.scss';
import MinimizeIcon from '../../assets/icons/minimize.svg?react';
import MaximizeIcon from '../../assets/icons/maximize.svg?react';
import CloseIcon from '../../assets/icons/close.svg?react';
import InfoIcon from '../../assets/icons/information.svg?react';

import { CloseWindow, MinimizeWindow } from '../../../../wailsjs/go/main/App';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';
import { DefaultModal } from '../../modals/DefaultModal/DefaultModal';
import { useState } from 'react';

import { aboutInformation } from '../../const'


export function WindowControlButton({ type }: { type: 'minimize' | 'maximize' | 'close' | 'info' }) {
    const batRunning = useSelector(selectBatRunning);

    const [infoOpen, setInfoOpen] = useState<boolean>(false)
    const [animateClose, setAnimateClose] = useState<boolean>(false)

    const handleClick = async () => {
        if (type === 'minimize') {
            await MinimizeWindow();
        } else if (type === 'maximize') {
            // await MaximizeWindow();
        } else if (type === 'close') {
            await CloseWindow();
        } else if (type === 'info') {
            if (!infoOpen) {
                setInfoOpen(true)
                setAnimateClose(false)
            }
            else {
                setAnimateClose(true)
                setTimeout(() => {
                    setInfoOpen(false)
                }, 180)
            }
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
            {type === 'info' && <InfoIcon className={s.icon} style={iconStyle} />}
            {type === 'info' && infoOpen && <DefaultModal animate={animateClose}>
                <h2>{aboutInformation.title}</h2>
                <p>{aboutInformation.text}</p>
            </DefaultModal>}
        </button>
    )
}