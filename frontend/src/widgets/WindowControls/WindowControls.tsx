import { useSelector } from 'react-redux';
import { WindowControlButton } from '../../shared/buttons';
import s from './WindowControls.module.scss';
import { selectBatRunning } from '../../app/model/slice';

export function WindowControls() {
    const batRunning = useSelector(selectBatRunning)

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
    }

    return (
        <div className={s.wrapper} style={wrapperStyle}>
            <WindowControlButton type='info' />
            <div>
                <WindowControlButton type="minimize" />
                <WindowControlButton type="close" />
            </div>
        </div>
    )
}