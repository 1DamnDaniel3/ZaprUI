import s from './BatList.module.scss';
import { BatCard } from '../../../../entities';
import { useEffect, useRef, useState } from 'react';
import { ElementLoader } from '../../../../shared';
import { useBat } from '../../../../shared/hooks/useBat';
import { useSound } from '../../../../shared/hooks/useSound';

interface BatListProps {
    batsReady?: boolean
}

export function BatList({ batsReady }: BatListProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animate, setAnimate] = useState<boolean>(false);

    const listRef = useRef<HTMLDivElement>(null);

    const { batToRun, batList, batRunning, changeBatToRun } = useBat()
    const { play } = useSound()

    const handleClick = () => {
        if (!isOpen) {
            setIsOpen(true)
            setAnimate(false)
            play('open')
        }
        else {
            setAnimate(true)
            play('close')
            setTimeout(() => {
                setIsOpen(false)
            }, 280)
        }
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (listRef.current && !listRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        })
    }, [])


    return (
        <div className={`${s.wrapper} ${batRunning ? s.wrapperRunning : ''}`} onClick={handleClick} ref={listRef}>
            <BatCard key={batToRun.id + batToRun.path} id={Number(batToRun.id)} path={batToRun.path} isOpen={isOpen} />
            {isOpen &&
                <div className={`${s.batList} ${batRunning ? s.runningList : ''} ${animate ? s.animate : ''}`}>
                    {batList && batsReady
                        ?
                        batList.map((bat) => (
                            <span
                                key={bat.id + bat.path}
                                className={`${s.option} ${batToRun.id === Number(bat.id) ? s.selected : ''} ${batRunning ? s.runningOption : ''}`}
                                onClick={() => changeBatToRun(bat)}
                            >
                                {bat.path.split('\\').pop()}
                            </span>
                        ))
                        :
                        Array.from({ length: 15 }).map((_, i) => (
                            <ElementLoader key={i} />
                        ))
                    }
                </div>}

        </div>
    );
}