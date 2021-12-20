import {connect} from 'react-redux';
import {buyItem} from '../redux/actions/character';
import {removeFromShop} from '../redux/actions/shop';

// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ShopCardItem from "./ShopCardItem";

function ShopCard(props) {
    const handleBuyAction = item => {
        if (props.character.items.length <= 2 && props.character.gold >= item.price) {
            props.buyItem(item);
            props.removeFromShop(item)
        }
    }

    return (
        <Paper>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">Welcome in Magic Shop</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {props.availableItems.map(item => {
                            return (
                                <Grid item xs={12} lg={4} key={item.id}>
                                    <ShopCardItem item={item} action={handleBuyAction} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

const mapStateToProps = state => {
    return {
        availableItems: state.shop.availableItems,
        character: state.character
    }
}

const mapDispatchToProps = dispatch => {
    return {
        buyItem: item => dispatch(buyItem(item)),
        removeFromShop: item => dispatch(removeFromShop(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopCard);