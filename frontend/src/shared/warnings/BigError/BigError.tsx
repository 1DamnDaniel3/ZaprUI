import s from './BigError.module.scss'
import { useEffect, useState } from 'react';
import { DefaultButton } from '../../buttons';
import { DefaultModal } from '../../modals/DefaultModal/DefaultModal';
import { CloseWindow, CopyLogsToClipboard, OpenURL } from '../../../../wailsjs/go/main/App';
import { playSound } from '../../lib/playSound';
import { useSelector } from 'react-redux';
import { selectSoundSwitch } from '../../../app/model/slice';

import criticalErrorSound from '../../assets/sounds/windows-xp-critical-stop.mp3'

interface BigErrorProps {
    bigError: string;
    setBigError: (error: string) => void;
}

export function BigError({ bigError, setBigError }: BigErrorProps) {
    const [isCopyDone, setIsCopyDone] = useState<boolean>(false);

    const soundState = useSelector(selectSoundSwitch)

    function handleOpenUrl(url: string) {
        OpenURL(url);
    }

    useEffect(() => {
        let timeout = setTimeout(() => setIsCopyDone(false), 3000);
        return () => clearTimeout(timeout);
    }, [isCopyDone])

    useEffect(() => {
        playSound(criticalErrorSound, 0.2, soundState)
    }, [])

    return (
        <DefaultModal onClick={() => {
            setBigError('')
            CloseWindow()
        }}>
            <div
                className={s.modalDiv}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ textAlign: 'center' }}>Ошибка</h2>
                <p className={s.error}>{bigError}</p>
                <DefaultButton
                    isActive={!isCopyDone}
                    title={isCopyDone ? 'Скопировано!' : 'Скопировать логи'}
                    onClick={() => {
                        CopyLogsToClipboard();
                        setIsCopyDone(true);
                    }}
                />
                <p>
                    Для скорейшего исправления ошибки, можете отправить логи
                    <br />
                    <a className={`${s.link}`} onClick={() => handleOpenUrl('https://github.com/1DamnDaniel3/ZaprUI/issues')}>сюда</a>
                </p>
                <span className={s.ok} onClick={() => CloseWindow()}>ОК</span>
            </div>
        </DefaultModal>
    )
}