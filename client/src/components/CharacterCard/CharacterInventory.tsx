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
};

export const CharacterInventory = ({ character }: CharacterInventoryProps) => {
  const dispatch = useDispatch();

  const emptySpaceInInventory = [];
  for (let n = character.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(
      <Grid item xs={12} lg={4} className="inventory-box" key={n} />,
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
  );
};
