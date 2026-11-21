import Card from '@mui/material/Card';
import { useSelector } from 'react-redux';

import { CharacterInventory } from '../components/CharacterCard';
import { AppState } from '../types';

export function InventoryCard() {
  const character = useSelector((state: AppState) => state.character);

  return (
    <Card sx={{ height: '100%' }}>
      <CharacterInventory character={character} allowDrop />
    </Card>
  );
}
