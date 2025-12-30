import { useDispatch } from 'react-redux';
import { useState, useLayoutEffect } from 'react';
import { ReadFile } from '../../../wailsjs/go/main/App';
import { setChosenBat } from '../../entities/BatCard/model/slice';
import { setSoundSwitch } from '../../app/model/slice';

export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
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
  }, [dispatch]);

  return { isInitialized };
};