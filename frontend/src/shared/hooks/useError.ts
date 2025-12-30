import { useDispatch, useSelector } from "react-redux"
import { selectCriticalError, selectWarning, setCriticalError, setWarning } from "../../app/model/slice"
import { WarningInterface } from "../interfaces/interfaces"
import { useEffect } from "react"

export const useError = () => {
    const dispatch = useDispatch()

    const warning = useSelector(selectWarning)
    const criticalError = useSelector(selectCriticalError)

    const newWarning = (warning: WarningInterface) => {
        dispatch(setWarning(warning))
    }

    const newCriticalError = (error: string) => {
        dispatch(setCriticalError(error))
    }

    useEffect(() => {
        if (!warning) return;
        let timeout = setTimeout(() => dispatch(setWarning(null)), 5000);
        return () => clearTimeout(timeout);
    }, [warning])

    return { warning, criticalError, newWarning, newCriticalError }
}