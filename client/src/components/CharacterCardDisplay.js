import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import {
  ActionButtons,
  CharacterInventory,
  CharacterName,
  CharacterStats,
} from './CharacterCard/';

export function CharacterCardDisplay({
  character,
  handleDropItem,
  handleNameChange,
  handleStatsChange,
  handleSave,
  handleEditMode,
  validation,
  points,
  statusCode,
  setStatusCode,
  stats,
}) {
  return (
    <Card>
      <CharacterName
        character={character}
        handleNameChange={handleNameChange}
        validation={validation}
      />

      <CardMedia component="img" height="140" image={character.image} />

      <CharacterStats
        character={character}
        handleStatsChange={handleStatsChange}
        points={points}
        stats={stats}
      />

      <ActionButtons
        character={character}
        handleEditMode={handleEditMode}
        handleSave={handleSave}
        points={points}
        setStatusCode={setStatusCode}
        statusCode={statusCode}
      />

      <CharacterInventory
        character={character}
        handleDropItem={handleDropItem}
      />
    </Card>
  );
}
