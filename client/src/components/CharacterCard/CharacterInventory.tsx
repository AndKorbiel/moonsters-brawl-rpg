import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import { useDispatch } from 'react-redux';

import {
  calculateStatsFromItem,
  dropItem,
} from '../../redux/actions/character';
import { CharacterState, Item } from '../../types';

type CharacterInventoryProps = {
  character: CharacterState;
  allowDrop: boolean;
};

export const CharacterInventory = ({
  character,
  allowDrop,
}: CharacterInventoryProps) => {
  const dispatch = useDispatch();

  const emptySpaceInInventory = [];
  for (let n = character.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(
      <Grid size={{ xs: 12, lg: 4 }} className="inventory-box" key={n} />,
    );
  }

  const handleDropItem = (item: Item) => {
    dispatch(dropItem(item));
    const itemWithReverseStats = [
      { name: item.stats[0].name, value: -item.stats[0].value },
    ];

    dispatch(calculateStatsFromItem(itemWithReverseStats));
  };

  return (
    <CardContent id="character-inventory">
      <Typography gutterBottom variant="h5" component="div">
        Inventory
      </Typography>

      <Grid container spacing={2} className="inventory-cont">
        {character.items.map((item) => (
          <Grid
            size={4}
            className="inventory-box"
            key={item.id}
            sx={{
              position: 'relative',
              '&:hover .inventory-drop-actions, &:focus-within .inventory-drop-actions':
                {
                  opacity: 1,
                  pointerEvents: 'auto',
                },
            }}
          >
            <CardMedia component="img" image={item.image} />
            {allowDrop && (
              <CardActions
                className="inventory-drop-actions"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  opacity: 0,
                  pointerEvents: 'none',
                  transition: 'opacity 150ms ease-in-out',
                }}
              >
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
  );
};
