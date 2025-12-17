import s from './RunZapret.module.scss';
import { useEffect } from 'react';
import { FindBats, RunBat } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { useDispatch, useSelector } from 'react-redux';
import { selectChosenBat, setBatFiles } from '../../entities/BatCard/model/slice';
import { RunButton } from '../../shared/buttons/RunButton/RunButton';

export function RunZapret() {
    const dispatch = useDispatch();
    const batToRun = useSelector(selectChosenBat)

    function runBat(id: number) {
        RunBat(id);
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

    return (
        <div className={s.wrapper}>
            <BatList />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />
        </div>
    );
}