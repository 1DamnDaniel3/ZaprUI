import { useDispatch, useSelector } from "react-redux"
import { selectSoundSwitch, setSoundSwitch } from "../../app/model/slice"
import { playSound } from "../lib/playSound"
import stopSound from '../assets/sounds/asd.mp3'
import runSound from '../assets/sounds/asdasd.mp3'
import backSound from '../assets/sounds/back.mp3'
import hoverSound from '../assets/sounds/menu.mp3'
import openSound from '../assets/sounds/pressing-a-computer-button.mp3'
import selectSound from '../assets/sounds/select.mp3'
import closeSound from '../assets/sounds/unpressing-a-computer-button.mp3'
import errorSound from '../assets/sounds/windows-xp-critical-stop.mp3'

type soundType = 'stop' | 'run' | 'back' | 'hover' | 'open' | 'select' | 'close' | 'error'

const volumeMap = {
    stop: 0.3,
    run: 0.1,
    back: 0.1,
    hover: 0.05,
    open: 0.2,
    select: 0.1,
    close: 0.2,
    error: 0.2,
}

const soundMap = {
    stop: stopSound,
    run: runSound,
    back: backSound,
    hover: hoverSound,
    open: openSound,
    select: selectSound,
    close: closeSound,
    error: errorSound,
}

export const useSound = () => {
    const soundState = useSelector(selectSoundSwitch);
    const dispatch = useDispatch()

    const play = (soundType: soundType) => {
        playSound(soundMap[soundType], volumeMap[soundType], soundState)
    }

    const toggleSound = () => {
        dispatch(setSoundSwitch(!soundState))
    }

    return { soundState, toggleSound, play }
}