import { useSelector } from 'react-redux';
import { CharacterLocalState } from '../modules';
import { AppState } from '../types';

export const useStatsChange = (
  setState: React.Dispatch<React.SetStateAction<CharacterLocalState>>,
) => {
  const { character } = useSelector((state: AppState) => ({
    character: state.character,
  }));

  const handleStatsChange = (name: string, amount: number) => {
    const baseStat = character.stats.find((stat) => stat.name === name);
    if (!baseStat) return;

    setState((currentState) => {
      const currentStat = currentState.stats?.find(
        (stat) => stat.name === name,
      );
      const currentPoints = currentState.points;
      if (!currentStat || currentPoints === undefined) return currentState;

      if (
        (amount > 0 && currentPoints < amount) ||
        (amount < 0 && currentStat.value + amount < baseStat.value)
      ) {
        return currentState;
      }

      return {
        ...currentState,
        stats: currentState.stats?.map((stat) =>
          stat.name === name
            ? { ...stat, value: stat.value + amount }
            : stat,
        ),
        points: currentPoints - amount,
      };
    });
  };

  return { handleStatsChange };
};
