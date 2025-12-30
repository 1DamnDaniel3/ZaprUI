import s from './DefaultWarning.module.scss';

interface DefaultWarningProps {
    text: string,
    type: 'info' | 'warning' | 'error'
}

export function DefaultWarning({ text, type }: DefaultWarningProps) {
    const typeBackgroundColorMap = {
        'info': 'var(--color-background-info)',
        'warning': 'var(--color-background-warning)',
        'error': 'var(--color-background-error)',
    };

    return (
        <div className={s.wrapper} style={{
            backgroundColor: typeBackgroundColorMap[type],
        }}>
            <p className={s.text}>{text}</p>
        </div>
    );
}