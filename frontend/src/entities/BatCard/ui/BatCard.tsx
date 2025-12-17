import s from './BatCard.module.scss';

export function BatCard({ id, path }: { id: number; path: string }) {
    return (
        <div className={s.batItem}>
            {path ?<span className={s.batPath}>{path.split('\\').pop()}</span> : 'Выбери файл'}
        </div>
    );
}