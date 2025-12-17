import s from './RunButton.module.scss';
import AppIcon from '../../../../../build/windows/icon.ico';
import { useState } from 'react';

export function RunButton({ title, onClick, isActive = true }: { title: string, onClick: () => void, isActive?: boolean }) {
    const [animate, setAnimate] = useState(false)
    
    const style = {
        backgroundColor: !isActive ? 'var(--color-border)' : undefined,
        PointerEvent: !isActive ? 'none' : 'auto',
    }

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`} onClick={handleClick}>
            <button className={s.btn} onClick={onClick} style={style}>
                <div className={s.top}>
                    <img src={AppIcon} className={s.icon} alt="Run Icon" />
                </div>
            </button>
        </div>
    );
}