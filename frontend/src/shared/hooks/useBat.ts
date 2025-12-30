import { useDispatch, useSelector } from "react-redux"
import { selectBatRunning, setBatRunning } from "../../app/model/slice"
import { selectBatFiles, selectChosenBat } from "../../entities/BatCard/model/slice"
import { useError } from "./useError"
import { useSound } from "./useSound"
import { KillBat, RunBat } from "../../../wailsjs/go/main/App"

export const useBat = () => {
    const batRunning = useSelector(selectBatRunning)
    const batToRun = useSelector(selectChosenBat)
    const batList = useSelector(selectBatFiles)

    const { newWarning } = useError()
    const { play } = useSound()

    const dispatch = useDispatch()

    const toggleBatRunning = () => {
        if (batRunning) {
            dispatch(setBatRunning(false))
        } else {
            dispatch(setBatRunning(true))
        }
    }

    const changeBatRunning = (state: boolean) => {
        dispatch(setBatRunning(state))
    }

    async function runBat(id: number) {
        if (id === -1) {
            newWarning({ text: 'Не выбран .bat файл', type: 'warning' });
            return;
        }

        try {
            if (batRunning) {
                await KillBat();
                play('stop')
                changeBatRunning(false);
            } else {
                await RunBat(id);
                play('run')
                changeBatRunning(true);
            }
        } catch {
            newWarning({ text: 'Ошибка при запуске .bat файла', type: 'error' });
        }
    }

    return { batRunning, batToRun, batList, toggleBatRunning, changeBatRunning, runBat }
}