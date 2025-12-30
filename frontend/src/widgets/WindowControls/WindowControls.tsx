import s from './WindowControls.module.scss';
import { WindowControlButton } from '../../shared/buttons';
import { useBat } from '../../shared/hooks/useBat';

export function WindowControls() {
    const { batRunning } = useBat()

    return (
        <div className={`${s.wrapper} ${batRunning ? s.running : ''}`}>
            <div>
                <WindowControlButton type='info' />
                <WindowControlButton type='theme' />
                <WindowControlButton type='sound' />
            </div>
            <div>
                <WindowControlButton type="minimize" />
                <WindowControlButton type="close" />
            </div>
        </div>
    )
}