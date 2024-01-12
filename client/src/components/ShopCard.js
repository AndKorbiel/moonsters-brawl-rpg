import { useDispatch, useSelector } from 'react-redux';
import { buyItem, calculateStatsFromItem } from '../redux/actions/character';
import { removeFromShop } from '../redux/actions/shop';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ShopCardItem from './ShopCardItem';

export default function ShopCard() {
  const dispatch = useDispatch();
  const { availableItems, character } = useSelector((state) => ({
    availableItems: state.shop.availableItems,
    character: state.character,
  }));

  const handleBuyAction = (item) => {
    if (character.items.length <= 2 && character.gold >= item.price) {
      dispatch(buyItem(item));
      dispatch(removeFromShop(item));
      dispatch(calculateStatsFromItem(item));
    }
  };

  return (
    <Paper className="topbot">
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom={true}>
          Welcome in the Magic Shop
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container>
          {availableItems.map((item) => {
            return (
              <Grid item xs={12} md={4} key={item.id}>
                <ShopCardItem item={item} action={handleBuyAction} />
              </Grid>
            );
          })}
        </Grid>

        {availableItems.length === 0 && (
          <Typography variant="h6" align="center">
            All item have been sold. Come back later.
          </Typography>
        )}
      </Grid>
    </Paper>
  );
}
