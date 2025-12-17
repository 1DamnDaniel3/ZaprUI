import { useState } from 'react';
import s from './BatCard.module.scss';

export function BatCard({ id, path }: { id: number; path: string }) {
    const [animate, setAnimate] = useState(false)

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.batItem} ${animate ? s.animate : ''}`} onClick={handleClick}>
            {path ? <span className={s.batPath}>{path.split('\\').pop()}</span> : 'Выбери файл'}
        </div>
    );
}