import { useSelector } from 'react-redux';

export const useStatsChange = (state, setState) => {
  const { character } = useSelector((state) => ({
    character: state.character,
  }));

  const updateState = (option, currentStat, currentPoints, name) => {
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

  const handleStatsChange = (e, option) => {
    const name = e.target.name;
    let currentStat = state.stats.filter((el) => el.name === name)[0].value;
    let currentPoints = state.points;

    console.log(currentPoints);

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
