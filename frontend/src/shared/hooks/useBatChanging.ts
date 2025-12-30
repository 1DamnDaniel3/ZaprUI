import { useEffect, useRef } from "react";
import { useBat } from "./useBat";
import { KillBat, RunBat } from "../../../wailsjs/go/main/App";
import { useError } from "./useError";

export const useBatChanging = () => {
    const { batToRun, batRunning, changeBatRunning } = useBat();
    const { newWarning } = useError()

    const wasRunningOnChange = useRef(false);

    useEffect(() => {
        if (batToRun.id === -1) return;
        // если в момент смены bat был запущен — запоминаем
        wasRunningOnChange.current = batRunning;

        if (batRunning) {
            KillBat()
                .then(() => {
                    changeBatRunning(false);
                    newWarning({ text: 'Смена .bat файла...', type: 'info' });

                    // запускаем новый ТОЛЬКО если прошлый был запущен
                    if (wasRunningOnChange.current) {
                        return RunBat(batToRun.id);
                    }
                })
                .then(() => {
                    if (wasRunningOnChange.current) {
                        changeBatRunning(true);
                    }
                })
                .catch(() => {
                    newWarning({ text: 'Ошибка при смене .bat файла', type: 'error' });
                });
        }
    }, [batToRun.id]);
}