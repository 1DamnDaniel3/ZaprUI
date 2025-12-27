import s from './RunZapret.module.scss';
import { useEffect, useLayoutEffect, useRef, useState, MouseEvent } from 'react';
import { FindBats, RunBat, KillBat, OpenURL, CopyLogsToClipboard } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenBat, setBatFiles } from '../../entities/BatCard/model/slice';
import { DefaultButton, RunButton } from '../../shared/buttons';
import { selectBatRunning, selectSoundSwitch, setBatRunning } from '../../app/model/slice';
import { DefaultWarning } from '../../shared';
import { playSound } from '../../shared/lib/playSound';
import runSound from '../../shared/assets/sounds/asdasd.mp3'
import offSound from '../../shared/assets/sounds/asd.mp3'
import { DefaultModal } from '../../shared/modals/DefaultModal/DefaultModal';

export function RunZapret() {
    interface errorInterface {
        text: string;
        type: 'info' | 'warning' | 'error';
    }

    const dispatch = useDispatch();
    const batToRun = useSelector(selectChosenBat);
    const batRunning = useSelector(selectBatRunning);
    const soundState = useSelector(selectSoundSwitch);

    const wasRunningOnChange = useRef(false);

    const [error, setError] = useState<errorInterface | null>(null);
    const [bigError, setBigError] = useState<string>('');
    const [batsReady, setBatsReady] = useState<boolean>(false);
    const [isCopyDone, setIsCopyDone] = useState<boolean>(false);

    async function runBat(id: number) {
        if (id === -1) {
            setError({ text: 'Не выбран .bat файл', type: 'warning' });
            return;
        }

        try {
            if (batRunning) {
                await KillBat();
                playSound(offSound, 0.3, soundState)
                dispatch(setBatRunning(false));
            } else {
                await RunBat(id);
                playSound(runSound, 0.1, soundState)
                dispatch(setBatRunning(true));
            }
        } catch {
            setError({ text: 'Ошибка при запуске .bat файла', type: 'error' });
        }
    }

    function handleOpenUrl(url: string) {
        OpenURL(url);
    }

    // Подписка на событие backend
    useLayoutEffect(() => {
        const findBatsHandler = () => {
            FindBats().then((bats) => {
                const result = Object.entries(bats).map(([id, path]) => ({ id, path }));
                dispatch(setBatFiles(result));
                setBatsReady(true);
            }).catch(() => {
                setBatsReady(false);
                setError({ text: 'Ошибка загрузки .bat файлов', type: 'error' })
            });
        };

        const newBigError = (error: string) => setBigError(error)

        // Подписка на событие backend
        window.runtime.EventsOn("release:ready", findBatsHandler);
        window.runtime.EventsOn("fatal-error", newBigError)
        window.runtime.EventsOn("non-critical-error", newBigError)
        // Очистка при демонтировании
        return () => {
            window.runtime.EventsOff("release:ready", findBatsHandler);
            window.runtime.EventsOff("fatal-error", newBigError);
            window.runtime.EventsOff("non-critical-error", newBigError);
        }
    }, []);

    useEffect(() => {
        if (!error) return;
        let timeout = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timeout);
    }, [error])

    useEffect(() => {
        let timeout = setTimeout(() => setIsCopyDone(false), 3000);
        return () => clearTimeout(timeout);
    }, [isCopyDone])

    useEffect(() => {
        if (batToRun.id === -1) return;
        // если в момент смены bat был запущен — запоминаем
        wasRunningOnChange.current = batRunning;

        if (batRunning) {
            KillBat()
                .then(() => {
                    dispatch(setBatRunning(false));
                    setError({ text: 'Смена .bat файла...', type: 'info' });

                    // запускаем новый ТОЛЬКО если прошлый был запущен
                    if (wasRunningOnChange.current) {
                        return RunBat(batToRun.id);
                    }
                })
                .then(() => {
                    if (wasRunningOnChange.current) {
                        dispatch(setBatRunning(true));
                    }
                })
                .catch(() => {
                    setError({ text: 'Ошибка при смене .bat файла', type: 'error' });
                });
        }
    }, [batToRun.id]);

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
    }

    return (
        <div className={s.wrapper} style={wrapperStyle}>
            {error && <DefaultWarning text={error.text} type={error.type} />}
            <BatList batsReady={batsReady} />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />

            {bigError &&
                <DefaultModal onClick={() => setBigError('')}>
                    <div
                        className={s.modalDiv}
                        onClick={(e) => e.stopPropagation()} // Добавлено здесь!
                    >
                        <h2 style={{ textAlign: 'center' }}>Ошибка</h2>
                        <p>{bigError}</p>
                        <DefaultButton
                            title={isCopyDone ? 'Скопировано!' : 'Скопировать логи'}
                            onClick={() => {
                                CopyLogsToClipboard();
                                setIsCopyDone(true);
                            }}
                        />
                        <p>
                            Для скорейшего исправления ошибки, можете отправить логи
                            <a className={`${s.link} ${s.github}`} onClick={() => handleOpenUrl('https://github.com/1DamnDaniel3/ZaprUI/issues')}> сюда</a>
                        </p>
                    </div>
                </DefaultModal>
            }
            <span className={`${s.footer} ${batRunning ? s.running : ''}`}>
                Authors: <a className={s.link} onClick={() => handleOpenUrl('https://github.com/1DamnDaniel3')}>1DamnDaniel3</a>
                , <a className={s.link} onClick={() => handleOpenUrl('https://github.com/Saltein')}>Saltein</a>
            </span>
        </div >
    );
}