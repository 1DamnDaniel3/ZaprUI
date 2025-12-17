import s from './DefaultButton.module.scss';

export function DefaultButton({title, onClick, isActive = true}: {title: string, onClick: () => void, isActive?: boolean}) {
    const style = {
        backgroundColor: !isActive ? 'var(--color-border)' : undefined,
        PointerEvent: !isActive ? 'none' : 'auto',
    }

    return (
        <div className={s.wrapper}>
            <button className={s.btn} onClick={onClick} style={style}>{title}</button>
        </div>
    );
}