import {connect} from 'react-redux';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ShopCardItem from "./ShopCardItem";

function ShopCard(props) {
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
                                    <ShopCardItem item={item} />
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
        availableItems: state.shop.availableItems
    }
}

export default connect(mapStateToProps, null)(ShopCard);