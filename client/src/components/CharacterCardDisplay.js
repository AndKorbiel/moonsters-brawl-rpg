import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();

  const emptySpaceInInventory = [];
  for (let n = character.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(
      <Grid item xs={12} lg={4} className="inventory-box" key={n} />,
    );
  }

  return (
    <Card>
      <CardContent>
        {character.isEditing ? (
          <TextField
            error={validation.name}
            helperText={
              !validation.name ? '' : 'Name be at least 2 characters long'
            }
            defaultValue={character.name}
            id="outlined-basic"
            label="Your name"
            onChange={(e) => handleNameChange(e)}
            variant="outlined"
          />
        ) : (
          <Typography gutterBottom variant="h5" component="div">
            {character.name}
          </Typography>
        )}
      </CardContent>

      <CardMedia component="img" height="140" image={character.image} />

      <CardActions className="stats">
        <ul>
          <li>
            <Typography variant="h6">Level: {character.level}</Typography>
          </li>
          <li>
            <Typography variant="h6">Gold: {character.gold}</Typography>
          </li>
          <li>
            <Typography variant="h6">Points to spend: {points}</Typography>
          </li>

          {character.stats.map((el) => (
            <li key={el.name}>
              {character.isEditing && (
                <Button
                  variant="contained"
                  name={el.name}
                  onClick={(e) => handleStatsChange(e, 'decrement')}
                >
                  -
                </Button>
              )}

              <Typography variant="h6">
                {`${el.name}: ${
                  character.isEditing
                    ? stats.filter((item) => item.name === el.name)[0].value
                    : el.value
                }`}
              </Typography>

              {character.isEditing && (
                <Button
                  variant="contained"
                  name={el.name}
                  onClick={(e) => handleStatsChange(e, 'increment')}
                >
                  +
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardActions>

      <CardContent>
        {character.isEditing ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        ) : (
          statusCode === 1 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEditMode(true)}
            >
              Set Stats
            </Button>
          )
        )}

        {!character.isEditing && statusCode === 1 && points === 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => dispatch(setStatusCode(2))}
          >
            Start game
          </Button>
        )}
      </CardContent>

      <CardContent id="character-inventory">
        <Typography gutterBottom variant="h5" component="div">
          Inventory
        </Typography>

        <Grid container spacing={2} className="inventory-cont">
          {character.items.map((item) => (
            <Grid item xs={4} className="inventory-box" key={item.id}>
              <CardMedia component="img" image={item.image} />
              {character.isEditing && (
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<HighlightOffIcon />}
                    onClick={() => handleDropItem(item)}
                  >
                    Drop item
                  </Button>
                </CardActions>
              )}
            </Grid>
          ))}
          {emptySpaceInInventory}
        </Grid>
      </CardContent>
    </Card>
  );
}
