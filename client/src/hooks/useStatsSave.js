import { useDispatch } from 'react-redux';

import {
  handleEditMode,
  setNewName,
  changeStats,
} from '../redux/actions/character';

export const useStatsSave = (state, setState) => {
  const dispatch = useDispatch();

  const handleSave = () => {
    if (state.name.length >= 2) {
      dispatch(setNewName(state.name));
      dispatch(handleEditMode(false));
      dispatch(
        changeStats({
          stats: state.stats,
          points: state.points,
          level: state.level,
          gold: state.gold,
        }),
      );

      setState((state) => ({
        ...state,
        validation: {
          ...state.validation,
          name: false,
        },
      }));
    } else {
      setState((state) => ({
        ...state,
        validation: {
          ...state.validation,
          name: true,
        },
      }));
    }
  };

  return { handleSave };
};
