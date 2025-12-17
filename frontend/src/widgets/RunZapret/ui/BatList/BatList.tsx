import s from './BatList.module.scss';
import { BatCard } from '../../../../entities';
import { useDispatch, useSelector } from 'react-redux';
import { selectBatFiles, selectChosenBat, setChosenBat } from '../../../../entities/BatCard/model/slice';
import { useEffect, useRef, useState } from 'react';
import { BatFile } from '../../../../entities/BatCard/model/interfaces';

export function BatList() {
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const listRef = useRef<HTMLDivElement>(null);

    const chosenBat = useSelector(selectChosenBat);
    const foundBats = useSelector(selectBatFiles);

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

    return (
        <div className={s.wrapper} onClick={handleClick} ref={listRef}>
            <BatCard key={chosenBat.id + chosenBat.path} id={Number(chosenBat.id)} path={chosenBat.path} />
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