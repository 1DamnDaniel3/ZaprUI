import s from './BatList.module.scss';
import { BatCard } from '../../../../entities';
import { useDispatch, useSelector } from 'react-redux';
import { selectBatFiles, selectChosenBat, setChosenBat } from '../../../../entities/BatCard/model/slice';
import { useEffect, useRef, useState } from 'react';
import { BatFile } from '../../../../entities/BatCard/model/interfaces';
import { selectBatRunning } from '../../../../app/model/slice';

export function BatList() {
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const listRef = useRef<HTMLDivElement>(null);

    const chosenBat = useSelector(selectChosenBat);
    const foundBats = useSelector(selectBatFiles);
    const batRunning = useSelector(selectBatRunning);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    const handleChoose = (bat: BatFile) => {
        dispatch(setChosenBat({ id: Number(bat.id), path: bat.path }));
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (listRef.current && !listRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        })
    }, [])

    const wrapperStyle = {
        backgroundColor: batRunning ? 'var(--color-primary-hover)' : undefined,
        boxShadow: batRunning ?
            `-8px -25px 40px var(--color-background-primary-bright),
        -8px -12px 20px var(--color-background-primary-bright),
        -25px 0px 40px var(--color-background-primary-bright),
        8px 25px 30px rgba(0, 0, 0, 0.4)` : undefined,
        borderColor: batRunning ? 'var(--color-primary-dark)' : undefined,
    }

    return (
        <div className={s.wrapper} onClick={handleClick} ref={listRef} style={wrapperStyle}>
            <BatCard key={chosenBat.id + chosenBat.path} id={Number(chosenBat.id)} path={chosenBat.path} isOpen={isOpen} />
            {isOpen && <div className={s.batList}>
                {foundBats && foundBats.map((bat) => (
                    <span
                        key={bat.id + bat.path}
                        className={`${s.option} ${chosenBat.id === Number(bat.id) ? s.selected : ''}`}
                        onClick={() => handleChoose(bat)}
                    >
                        {bat.path.split('\\').pop()}
                    </span>
                ))}
            </div>}
        </div>
    );
}