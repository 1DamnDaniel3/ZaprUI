import { PropsWithChildren } from 'react';
import s from './DefaultModal.module.scss';
import { useSelector } from 'react-redux';
import { selectBatRunning } from '../../../app/model/slice';

type DefaultModalProps = {
    animate?: boolean;
};

export function DefaultModal({
    children,
    animate,
}: PropsWithChildren<DefaultModalProps>) {
    const batRunning = useSelector(selectBatRunning)

    return (
        <div className={`${s.wrapper} ${animate ? s.animate : ''}`}>
            <div className={`${s.window} ${batRunning ? s.running : ''}`}>
                {children}
            </div>
        </div>
    );
}