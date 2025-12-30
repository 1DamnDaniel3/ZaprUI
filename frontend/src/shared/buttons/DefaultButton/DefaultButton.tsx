import s from './DefaultButton.module.scss';

interface DefaultButtonProps {
    title: string,
    onClick: () => void,
    isActive?: boolean
}

export function DefaultButton({ title, onClick, isActive = true }: DefaultButtonProps) {
    return (
        <div className={`${s.wrapper} ${s.running}`}>
            <button className={`${s.btn} ${!isActive ? s.passive : ''}`} onClick={onClick}>{title}</button>
        </div>
    );
}