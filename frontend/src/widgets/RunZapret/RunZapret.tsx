import s from './RunZapret.module.scss';
import { useEffect } from 'react';
import { FindBats, RunBat, KillBat } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenBat, setBatFiles } from '../../entities/BatCard/model/slice';
import { RunButton } from '../../shared/buttons';
import { selectBatRunning, setBatRunning } from '../../app/model/slice';

export function RunZapret() {
    const dispatch = useDispatch();
    const batToRun = useSelector(selectChosenBat);
    const batRunning = useSelector(selectBatRunning);

    function runBat(id: number) {
        if (batRunning) {
            KillBat().then(() => dispatch(setBatRunning(false)));
            return;
        }
        RunBat(id).then(() => dispatch(setBatRunning(true)));
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

    useEffect(() => {
        findBats();
    }, []);

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
    }

    return (
        <div className={s.wrapper} style={wrapperStyle}>
            <BatList />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />
        </div>
    );
}