import { useState } from 'react';
import s from './BatCard.module.scss';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

import ArrowIcon from '../../../shared/assets/icons/arrow-up.svg?react';


export function BatCard({ id, path, isOpen }: { id: number; path: string; isOpen: boolean }) {
    const [animate, setAnimate] = useState(false)

    const batRunning = useSelector(selectBatRunning);

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
        boxShadow: batRunning ? 'none' : undefined,
    }

    const arrowStyle = {
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.1s ease-in-out',
    }

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.batItem} ${animate ? s.animate : ''}`} onClick={handleClick} style={wrapperStyle}>
            {path ? <span className={s.batPath}>{path.split('\\').pop()}</span> : 'Выбери файл'}
            {batRunning && <span className={s.running}>работает...</span>}
            <ArrowIcon className={s.icon} style={arrowStyle} />
        </div>
    );
}