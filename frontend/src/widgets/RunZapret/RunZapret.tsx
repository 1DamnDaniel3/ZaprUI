import s from './RunZapret.module.scss';
import { useEffect, useState } from 'react';
import { FindBats, RunBat, KillBat, OpenURL } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenBat, setBatFiles } from '../../entities/BatCard/model/slice';
import { RunButton } from '../../shared/buttons';
import { selectBatRunning, setBatRunning } from '../../app/model/slice';
import { DefaultWarning } from '../../shared';

export function RunZapret() {
    const dispatch = useDispatch();
    const batToRun = useSelector(selectChosenBat);
    const batRunning = useSelector(selectBatRunning);

    interface errorInterface {
        text: string;
        type: 'info' | 'warning' | 'error';
    }

    const [error, setError] = useState<errorInterface | null>(null);

    function runBat(id: number) {
        if (batToRun.id === -1) {
            setError({ text: 'Не выбран .bat файл', type: 'warning' });
            return;
        }
        if (batRunning) {
            KillBat()
                .then(() => dispatch(setBatRunning(false)))
                .catch((err) => {
                    setError({ text: `Ошибка при остановке .bat файла`, type: 'error' });
                });
            return;
        }
        RunBat(id)
            .then(() => dispatch(setBatRunning(true)))
            .catch((err) => {
                setError({ text: `Ошибка при запуске .bat файла`, type: 'error' });
            });
        return;
    }

    function findBats() {
        FindBats().then((bats) => {
            let result = [];
            for (const [id, path] of Object.entries(bats)) {
                result.push({ id: id, path: path });
            }
            dispatch(setBatFiles(result));
        });
    }

    function handleOpenUrl(url: string) {
        OpenURL(url);
    }

    useEffect(() => {
        findBats();
    }, []);

    useEffect(() => {
        let timeout = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timeout);
    }, [error])

    useEffect(() => {
        setError(null);
    }, [batToRun])

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
    }

    return (
        <div className={s.wrapper} style={wrapperStyle}>
            {error && <DefaultWarning text={error.text} type={error.type} />}
            <BatList />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />
            <span className={s.footer}>
                Authors: <a className={s.link} onClick={() => handleOpenUrl('https://github.com/1DamnDaniel3')}>1DamnDaniel3</a>
                , <a className={s.link} onClick={() => handleOpenUrl('https://github.com/Saltein')}>Saltein</a>
            </span>
        </div >
    );
}