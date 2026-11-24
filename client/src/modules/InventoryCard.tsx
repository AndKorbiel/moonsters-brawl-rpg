import { useSelector } from 'react-redux';

import { CharacterInventory } from '../components/CharacterCard';
import { PixelPanel } from '../components/ui/PixelPanel';
import { colors } from '../theme/tokens';
import { AppState } from '../types';

export function InventoryCard() {
  const character = useSelector((state: AppState) => state.character);

  return (
    <PixelPanel sx={{ height: '100%', backgroundColor: colors.panel }}>
      <CharacterInventory character={character} allowDrop />
    </PixelPanel>
  );
}
