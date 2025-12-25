import s from './InfoModal.module.scss'
import { DefaultModal } from '../../../modals/DefaultModal/DefaultModal'
import { GetZapretVersion, GetZaprUIVersion, OpenURL } from '../../../../../wailsjs/go/main/App'

import { aboutInformation } from '../../../const'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectBatRunning } from '../../../../app/model/slice'

interface InfoModalProps {
    animateClose: boolean
}

export function InfoModal({ animateClose }: InfoModalProps) {
    const [zapretVersion, setZapretVersion] = useState<string>('')
    const [zaprUIVersion, setZaprUIVersion] = useState<string>('')

    const batRunning = useSelector(selectBatRunning);

    useEffect(() => {
        GetZapretVersion()
            .then((version) => setZapretVersion(version))
            .catch(() => setZapretVersion('Ошибка'))
        GetZaprUIVersion()
            .then((version) => setZaprUIVersion(version))
            .catch(() => setZaprUIVersion('Ошибка'))
    }, [])

    return (
        <DefaultModal animate={animateClose}>
            <div className={s.infoDiv}>
                <h2>{aboutInformation.title}</h2>
                <p className={s.infoP}>
                    {aboutInformation.text}
                    <a className={s.link} onClick={() => { OpenURL('https://github.com/Flowseal/zapret-discord-youtube/releases') }}>
                        Ссылка на zapret-discord-youtube
                    </a>
                </p>
                <div className={`${s.versions} ${batRunning ? s.running : ''}`}>
                    <span>Версия zapret - {zapretVersion}</span>
                    <span>Версия приложения - {zaprUIVersion}</span>
                </div>
            </div>
        </DefaultModal>
    )
}