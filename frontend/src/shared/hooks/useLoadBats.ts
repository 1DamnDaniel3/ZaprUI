import { useLayoutEffect, useState } from "react";
import { FindBats } from "../../../wailsjs/go/main/App";
import { useDispatch } from "react-redux";
import { setBatFiles } from "../../entities/BatCard/model/slice";
import { useError } from "./useError";

export const useLoadBats = () => {
    const [batsReady, setBatsReady] = useState(false);

    const { newWarning, newCriticalError } = useError()

    const dispatch = useDispatch()

    useLayoutEffect(() => {
        const findBatsHandler = () => {
            FindBats().then((bats) => {
                const result = Object.entries(bats).map(([id, path]) => ({ id, path }));
                dispatch(setBatFiles(result));
                setBatsReady(true);
            }).catch(() => {
                setBatsReady(false);
                newWarning({ text: 'Ошибка загрузки .bat файлов', type: 'error' })
            });
        };

        const newBigError = (error: string) => newCriticalError(error)
        const newSmallError = (error: string) => newWarning({ type: 'error', text: error })

        // Подписка на событие backend
        window.runtime.EventsOn("release:ready", findBatsHandler);
        window.runtime.EventsOn("fatal-error", newBigError)
        window.runtime.EventsOn("non-critical-error", newSmallError)
        // Очистка при демонтировании
        return () => {
            window.runtime.EventsOff("release:ready", findBatsHandler);
            window.runtime.EventsOff("fatal-error", newBigError);
            window.runtime.EventsOff("non-critical-error", newSmallError);
        }
    }, []);

    return { batsReady }
}