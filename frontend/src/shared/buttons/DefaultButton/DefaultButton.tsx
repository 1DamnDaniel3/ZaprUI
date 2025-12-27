import s from './DefaultButton.module.scss';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

export function DefaultButton({title, onClick, isActive = true}: {title: string, onClick: () => void, isActive?: boolean}) {
    const batRunning = useSelector(selectBatRunning)

    const style = {
        backgroundColor: !isActive ? 'var(--color-border)' : undefined,
        PointerEvent: !isActive ? 'none' : 'auto',
    }

    return (
        <div className={`${s.wrapper} ${s.running}`}>
            <button className={s.btn} onClick={onClick} style={style}>{title}</button>
        </div>
    );
}