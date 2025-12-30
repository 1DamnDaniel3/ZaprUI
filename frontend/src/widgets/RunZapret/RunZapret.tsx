import s from './RunZapret.module.scss';
import { OpenURL } from '../../../wailsjs/go/main/App';
import { BatList } from './ui/BatList/BatList';
import { RunButton } from '../../shared/buttons';
import { DefaultWarning } from '../../shared';
import { BigError } from '../../shared/warnings';
import { useBat } from '../../shared/hooks/useBat';
import { useError } from '../../shared/hooks/useError';
import { useLoadBats } from '../../shared/hooks/useLoadBats';
import { useBatChanging } from '../../shared/hooks/useBatChanging';

export function RunZapret() {
    const { batToRun, batRunning, runBat } = useBat();
    const { warning, criticalError, newCriticalError } = useError()
    const { batsReady } = useLoadBats()

    useBatChanging()

    return (
        <div className={`${s.wrapper} ${batRunning ? s.running : ''}`}>
            {warning && <DefaultWarning text={warning.text} type={warning.type} />}
            <BatList batsReady={batsReady} />
            <RunButton title='Run Bat' onClick={() => runBat(batToRun.id)} />

            {criticalError && <BigError bigError={criticalError} setBigError={newCriticalError} />}

            <span className={`${s.footer} ${batRunning ? s.running : ''}`}>
                Authors: <a className={s.link} onClick={() => OpenURL('https://github.com/1DamnDaniel3')}>1DamnDaniel3</a>
                , <a className={s.link} onClick={() => OpenURL('https://github.com/Saltein')}>Saltein</a>
            </span>
        </div >
    );
}