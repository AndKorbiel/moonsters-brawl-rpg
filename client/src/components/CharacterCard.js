import {connect} from "react-redux";
// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function CharacterCard(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={props.character.image}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                {props.character.stats.map(el => {
                    return (
                    <Typography variant="h5">
                        {el.name}: {el.value}
                    </Typography>
                    )
                })}
            </CardActions>
        </Card>
    )
}

const mapStateToProps = state => {
    return {
        character: state.character
    }
}

export default connect(mapStateToProps, null)(CharacterCard)