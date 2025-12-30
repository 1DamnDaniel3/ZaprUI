import s from './DefaultModal.module.scss';
import { PropsWithChildren, MouseEvent } from 'react';
import { useBat } from '../../hooks/useBat';

type DefaultModalProps = {
    animate?: boolean;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export function DefaultModal({
    children,
    animate,
    onClick,
}: PropsWithChildren<DefaultModalProps>) {
    const { batRunning } = useBat()

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`} onClick={onClick}>
            <div className={`${s.window} ${batRunning ? s.running : ''}`}>
                {children}
            </div>
        </div>
    );
}