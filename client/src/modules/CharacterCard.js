import Grid from '@mui/material/Grid';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  handleEditMode,
  dropItem,
  calculateStatsFromItem,
} from '../redux/actions/character';
import { setStatusCode } from '../redux/actions/game';
import { CharacterCardDisplay } from '../components/CharacterCardDisplay';
import { useStatsChange, useStatsSave } from '../hooks';

export const CharacterCardContainer = () => {
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
        console.log('done???');
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

  const { handleStatsChange } = useStatsChange(state, setState);
  const { handleSave } = useStatsSave(state, setState);

  const handleDropItem = (item) => {
    dispatch(dropItem(item));
    const itemWithReverseStats = [
      { name: item.stats[0].name, value: -item.stats[0].value },
    ];
    dispatch(calculateStatsFromItem({ stats: itemWithReverseStats }));
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
      handleEditMode={() => dispatch(handleEditMode(true))}
      handleSave={handleSave}
      handleDropItem={handleDropItem}
      setStatusCode={setStatusCode}
      statusCode={statusCode}
    />
  );
};
