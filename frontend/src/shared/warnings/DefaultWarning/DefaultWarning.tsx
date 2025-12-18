import s from './DefaultWarning.module.scss';

export function DefaultWarning({ text, type }: { text: string, type: 'info' | 'warning' | 'error' }) {
    const typeBackgroundColorMap = {
        'info': 'var(--color-background-info)',
        'warning': 'var(--color-background-warning)',
        'error': 'var(--color-background-error)',
    };

    const typeTextColorMap = {
        'info': 'var(--color-text-info)',
        'warning': 'var(--color-text-warning)',
        'error': 'var(--color-text-error)',
    };

    return (
        <div className={s.wrapper} style={{
            backgroundColor: typeBackgroundColorMap[type],
            color: typeTextColorMap[type],
        }}>
            <p className={s.text}>{text}</p>
        </div>
    );
}