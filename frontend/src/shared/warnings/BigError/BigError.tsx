import s from './BigError.module.scss'
import { useEffect, useState } from 'react';
import { DefaultButton } from '../../buttons';
import { DefaultModal } from '../../modals/DefaultModal/DefaultModal';
import { CloseWindow, CopyLogsToClipboard, OpenURL } from '../../../../wailsjs/go/main/App';
import { useSound } from '../../hooks/useSound';

interface BigErrorProps {
    bigError: string;
    setBigError: (error: string) => void;
}

export function BigError({ bigError, setBigError }: BigErrorProps) {
    const [isCopyDone, setIsCopyDone] = useState<boolean>(false);

    const { play } = useSound()

    useEffect(() => {
        let timeout = setTimeout(() => setIsCopyDone(false), 3000);
        return () => clearTimeout(timeout);
    }, [isCopyDone])

    useEffect(() => {
        play('error')
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
                    <a className={`${s.link}`} onClick={() => OpenURL('https://github.com/1DamnDaniel3/ZaprUI/issues')}>сюда</a>
                </p>
                <span className={s.ok} onClick={() => CloseWindow()}>ОК</span>
            </div>
        </DefaultModal>
    )
}