import s from './RunZapret.module.scss';
import { useEffect, useRef, useState } from 'react';
import { FindBats, RunBat, KillBat, OpenURL } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenBat, setBatFiles } from '../../entities/BatCard/model/slice';
import { RunButton } from '../../shared/buttons';
import { selectBatRunning, setBatRunning } from '../../app/model/slice';
import { DefaultWarning } from '../../shared';
import { playSound } from '../../shared/lib/playSound';
import runSound from '../../shared/assets/sounds/asdasd.mp3'
import offSound from '../../shared/assets/sounds/asd.mp3'

export function RunZapret() {
    interface errorInterface {
        text: string;
        type: 'info' | 'warning' | 'error';
    }

    const dispatch = useDispatch();
    const batToRun = useSelector(selectChosenBat);
    const batRunning = useSelector(selectBatRunning);

    const wasRunningOnChange = useRef(false);

    const [error, setError] = useState<errorInterface | null>(null);
    const [batsReady, setBatsReady] = useState<boolean>(false);

    async function runBat(id: number) {
        if (id === -1) {
            setError({ text: 'Не выбран .bat файл', type: 'warning' });
            return;
        }

        try {
            if (batRunning) {
                await KillBat();
                playSound(offSound, 0.3)
                dispatch(setBatRunning(false));
            } else {
                await RunBat(id);
                playSound(runSound, 0.2)
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
    useEffect(() => {
        const handler = () => {
            FindBats().then((bats) => {
                const result = Object.entries(bats).map(([id, path]) => ({ id, path }));
                dispatch(setBatFiles(result));
                setBatsReady(true);
            }).catch(() => {
                setBatsReady(false);
                setError({ text: 'Ошибка загрузки .bat файлов', type: 'error' })
            });
        };
        // Подписка на событие backend
        window.runtime.EventsOn("release:ready", handler);
        // Очистка при демонтировании
        return () => window.runtime.EventsOff("release:ready", handler);
    }, []);

    useEffect(() => {
        let timeout = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timeout);
    }, [error])

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

    const footerStyle = {
        color: batRunning ? 'var(--color-primary-dark)' : undefined,
    }

    return (
        <div className={s.wrapper} style={wrapperStyle}>
            {error && <DefaultWarning text={error.text} type={error.type} />}
            <BatList batsReady={batsReady} />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />

            <span className={s.footer} style={footerStyle}>
                Authors: <a className={s.link} onClick={() => handleOpenUrl('https://github.com/1DamnDaniel3')}>1DamnDaniel3</a>
                , <a className={s.link} onClick={() => handleOpenUrl('https://github.com/Saltein')}>Saltein</a>
            </span>
        </div >
    );
}