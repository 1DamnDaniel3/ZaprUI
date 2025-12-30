import { useDispatch, useSelector } from "react-redux"
import { selectBatRunning, setBatRunning } from "../../app/model/slice"
import { selectBatFiles, selectChosenBat } from "../../entities/BatCard/model/slice"

export const useBat = () => {
    const batRunning = useSelector(selectBatRunning)
    const batToRun = useSelector(selectChosenBat)
    const batList = useSelector(selectBatFiles)

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

    return { batRunning, batToRun, batList, toggleBatRunning, changeBatRunning }
}