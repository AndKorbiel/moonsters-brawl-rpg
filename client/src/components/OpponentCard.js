import {connect} from 'react-redux'

// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function OpponentCard(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.opponent.name}
                    </Typography>
            </CardContent>
            <CardMedia
                component="img"
                height="140"
                image={props.opponent.image}
            />
            <CardActions className="stats">
                <ul>
                    <li>
                        <Typography variant="h6">
                            Level: {props.opponent.level}
                        </Typography>
                    </li>
                    {props.opponent.stats.map(el => {
                        return (
                            <li key={el.name}>
                                <Typography variant="h6">
                                    {el.name}: {el.value}
                                </Typography>
                            </li>
                        )
                    })}
                </ul>
            </CardActions>
        </Card>
    )
}

const mapStateToProps = state => {
    return {
        opponent: state.opponent
    }
}

export default connect(mapStateToProps, null)(OpponentCard)