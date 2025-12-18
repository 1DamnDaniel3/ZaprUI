import { WindowControlButton } from '../../shared/buttons';
import s from './WindowControls.module.scss';

export function WindowControls() {
    return (
        <div className={s.wrapper}>
            <WindowControlButton type="minimize" />
            <WindowControlButton type="close" />
        </div>
    )
}