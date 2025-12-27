import { PropsWithChildren, MouseEvent } from 'react';
import s from './DefaultModal.module.scss';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

type DefaultModalProps = {
    animate?: boolean;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export function DefaultModal({
    children,
    animate,
    onClick,
}: PropsWithChildren<DefaultModalProps>) {
    const batRunning = useSelector(selectBatRunning)

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`} onClick={onClick}>
            <div className={`${s.window} ${batRunning ? s.running : ''}`}>
                {children}
            </div>
        </div>
    );
}