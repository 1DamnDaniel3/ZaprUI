import { useState } from 'react';
import s from './BatCard.module.scss';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

export function BatCard({ id, path }: { id: number; path: string }) {
    const [animate, setAnimate] = useState(false)

    const batRunning = useSelector(selectBatRunning);

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
        boxShadow: batRunning ? 'none' : undefined,
    }

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.batItem} ${animate ? s.animate : ''}`} onClick={handleClick} style={wrapperStyle}>
            {path ? <span className={s.batPath}>{path.split('\\').pop()}</span> : 'Выбери файл'}
        </div>
    );
}