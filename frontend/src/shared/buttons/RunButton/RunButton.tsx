import s from './RunButton.module.scss';
import AppIcon from '../../../../../build/windows/icon.ico';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

export function RunButton({ onClick }: { title: string, onClick: () => void, isActive?: boolean }) {
    const [animate, setAnimate] = useState(false)

    const batRunning = useSelector(selectBatRunning);

    const btnStyle = {
        backgroundColor: batRunning ? 'var(--color-primary-hover)' : undefined,
        boxShadow: batRunning ?
            `-15px -50px 75px var(--color-background-primary-bright),
        -15px -25px 40px var(--color-background-primary-bright),
        -50px 0px 75px var(--color-background-primary-bright),
        15px 50px 60px rgba(0, 0, 0, 0.4)` : undefined,
        borderColor: batRunning ? 'var(--color-primary-dark)' : undefined,
    }

    const topStyle = {
        backgroundColor: batRunning ? 'var(--color-background-primary)' : undefined,
        boxShadow: batRunning ? 'none' : undefined,
    }

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 200);
    }

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`} onClick={handleClick}>
            <button className={s.btn} onClick={onClick} style={btnStyle}>
                <div className={s.top} style={topStyle}>
                    <img src={AppIcon} className={s.icon} alt="Run Icon" />
                </div>
            </button>
        </div>
    );
}