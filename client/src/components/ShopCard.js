import { connect } from 'react-redux';
import { buyItem, calculateStatsFromItem } from '../redux/actions/character';
import { removeFromShop } from '../redux/actions/shop';

// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ShopCardItem from './ShopCardItem';

function ShopCard(props) {
  const handleBuyAction = (item) => {
    if (
      props.character.items.length <= 2 &&
      props.character.gold >= item.price
    ) {
      props.buyItem(item);
      props.removeFromShop(item);
      props.calculateStatsFromItem(item);
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
          {props.availableItems.map((item) => {
            return (
              <Grid item xs={12} md={4} key={item.id}>
                <ShopCardItem item={item} action={handleBuyAction} />
              </Grid>
            );
          })}
        </Grid>
        {props.availableItems.length === 0 ? (
          <Typography variant="h6" align="center">
            All item have been sold. Come back later.
          </Typography>
        ) : (
          ''
        )}
      </Grid>
    </Paper>
  );
}

const mapStateToProps = (state) => {
  return {
    availableItems: state.shop.availableItems,
    character: state.character,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buyItem: (item) => dispatch(buyItem(item)),
    removeFromShop: (item) => dispatch(removeFromShop(item)),
    calculateStatsFromItem: (item) =>
      dispatch(calculateStatsFromItem(item.stats)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopCard);
