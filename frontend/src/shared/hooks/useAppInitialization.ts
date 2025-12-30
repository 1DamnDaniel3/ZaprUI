import { useDispatch } from 'react-redux';
import { useState, useLayoutEffect } from 'react';
import { ReadFile } from '../../../wailsjs/go/main/App';
import { setChosenBat } from '../../entities/BatCard/model/slice';
import { setSoundSwitch, setTheme } from '../../app/model/slice';

export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    const initializeTheme = async () => {
      return ReadFile('themeProperties.json')
        .then((data) => {
          if (data.hasOwnProperty('theme')) {
            dispatch(setTheme(data.theme));
          }
        });
    };

    const initializeApp = async () => {
      document.documentElement.classList.add('no-transition');

      try {
        await Promise.all([
          ReadFile('batProperties.json')
            .then((data) => {
              if (data.hasOwnProperty('chosenBat')) {
                dispatch(setChosenBat(data.chosenBat));
              }
            }),
          ReadFile('soundProperties.json')
            .then((data) => {
              if (data.hasOwnProperty('soundState')) {
                dispatch(setSoundSwitch(data.soundState));
              }
            })
        ]);

        setTimeout(() => {
          document.documentElement.classList.remove('no-transition');
          setIsInitialized(true);
        }, 50);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        document.documentElement.classList.remove('no-transition');
        setIsInitialized(true);
      }
    };

    initializeApp();
    initializeTheme();
  }, [dispatch]);

  return { isInitialized };
};