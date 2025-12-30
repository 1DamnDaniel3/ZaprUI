import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect } from 'react';
import { selectTheme, setTheme } from '../../app/model/slice';
import { ReadFile } from '../../../wailsjs/go/main/App';

export const useTheme = () => {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);

    useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const changeTheme = (theme: 'dark' | 'light') => {
        dispatch(setTheme(theme))
        document.documentElement.setAttribute('data-theme', theme)
    }

    const toggleTheme = () => {
        if (theme === 'light') {
            dispatch(setTheme('dark'))
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            dispatch(setTheme('light'))
            document.documentElement.setAttribute('data-theme', 'light')
        }
    }

    return { theme, changeTheme, toggleTheme };
};