import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  handleEditMode,
  setNewName,
  changeStats,
  dropItem,
  calculateStatsFromItem,
} from '../redux/actions/character';
import { setStatusCode } from '../redux/actions/game';
import { CharacterCardDisplay } from '../components/CharacterCardDisplay';

export const CharacterCardContainer = (props) => {
  const dispatch = useDispatch();
  const { character, statusCode } = useSelector((state) => ({
    character: state.character,
    statusCode: state.game.statusCode,
  }));

  const [state, setState] = useState({
    validation: {
      name: false,
    },
  });

  useEffect(
    (previousProps) => {
      if (previousProps?.character !== character) {
        setState((state) => ({
          ...state,
          ...character,
        }));
      }
    },
    [character],
  );

  const handleNameChange = (e) => {
    setState((state) => ({
      ...state,
      name: e.target.value,
    }));
  };

  const handleStatsChange = (e, option) => {
    const name = e.target.name;
    let currentStat = state.stats.filter((el) => el.name === name)[0].value;
    let currentPoints = state.points;
    const statisticValueFromStore = character.stats.filter(
      (el) => el.name === name,
    )[0].value;

    const updateState = () => {
      let action = '+';
      if (option === 'decrement') {
        action = '-';
      }

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

    if (option === 'increment') {
      if (currentPoints > 0) {
        updateState();
      }
    } else {
      if (currentStat > statisticValueFromStore) {
        updateState();
      }
    }
  };

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

  const handleDropItem = (item) => {
    dispatch(dropItem(item));
    const itemWithReverseStats = [
      { name: item.stats[0].name, value: -item.stats[0].value },
    ];
    dispatch(calculateStatsFromItem(itemWithReverseStats));
  };

  const setToEditModeAndCalculateStats = () => {
    setState((state) => ({
      ...state,
      ...character,
    }));

    dispatch(handleEditMode(true));
  };

  let emptySpaceInInventory = [];
  for (let n = character?.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(
      <Grid item xs={12} lg={4} className="inventory-box" key={n} />,
    );
  }

  return (
    <CharacterCardDisplay
      data-testid="character-card"
      character={character}
      validation={state.validation}
      points={state.points}
      stats={state.stats}
      handleNameChange={handleNameChange}
      handleStatsChange={handleStatsChange}
      handleEditMode={setToEditModeAndCalculateStats}
      handleSave={handleSave}
      handleDropItem={handleDropItem}
      setStatusCode={setStatusCode}
      statusCode={statusCode}
    />
  );
};
