import { useSelector } from 'react-redux';
import { CharacterLocalState } from '../modules';
import { AppState } from '../types';

export const useStatsChange = (
  state: CharacterLocalState,
  setState: React.Dispatch<React.SetStateAction<CharacterLocalState>>,
) => {
  const { character } = useSelector((state: AppState) => ({
    character: state.character,
  }));

  const updateState = (
    option: string,
    currentStat: number,
    currentPoints: number,
    name: string,
  ) => {
    const action = option === 'decrement' ? '-' : '+';

    setState((state) => ({
      ...state,
      stats: [
        ...state.stats.map((el) => {
          if (el.name === name) {
            return { name, value: currentStat + parseFloat(action + 1) };
          } else {
            return el;
          }
        }),
      ],
      points: currentPoints - parseFloat(action + 1),
    }));
  };

  const handleStatsChange = (name: string, option: string) => {
    const currentStat = state.stats.filter((el) => el.name === name)[0].value;
    const currentPoints = state.points;
    const baseStat = character.stats.filter((el) => el.name === name)[0].value;

    if (option === 'increment') {
      if (currentPoints > 0) {
        updateState(option, currentStat, currentPoints, name);
      }
    } else if (currentStat > baseStat) {
      updateState(option, currentStat, currentPoints, name);
    }
  };

  return { handleStatsChange };
};
