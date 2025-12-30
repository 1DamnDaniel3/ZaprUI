import s from './BatCard.module.scss';
import { useState } from 'react';
import { useBat } from '../../../shared/hooks/useBat';
import ArrowIcon from '../../../shared/assets/icons/arrow-up.svg?react';

interface BatCardProps {
    id: number;
    path: string;
    isOpen: boolean;
}

export function BatCard({ id, path, isOpen }: BatCardProps) {
    const [animate, setAnimate] = useState(false)

    const { batRunning } = useBat()

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.batItem} ${animate ? s.animate : ''} ${batRunning ? s.btnRunning : ''}`}
            onClick={handleClick}
        >
            {path ? <span className={s.batPath}>{path.split('\\').pop()}</span> : 'Выбери файл'}
            {batRunning && <span className={s.running}>работает...</span>}
            <ArrowIcon className={`${s.icon} ${batRunning ? s.iconRunning : ''} ${isOpen ? s.iconOpen : ''}`} />
        </div>
    );
}