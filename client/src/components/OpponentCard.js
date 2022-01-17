import {connect} from 'react-redux'
import {useState, useEffect} from "react";
// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function OpponentCard(props) {
    let [opponentStats, setStats] = useState();

    const handleSetStats = () => {
        const opp = {...props.opponent}
        const points = opp.points;
        const stats = opp.stats.map(el => el);
        const  randomIntFromInterval = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        for (let n = points; n > 0; n--) {
            const random = randomIntFromInterval(0,2)
            switch(random) {
                case 0 :
                    stats.filter(el => el.name === 'attack')[0].value = stats.filter(el => el.name === 'attack')[0].value + 1
                    break;
                case 1:
                    stats.filter(el => el.name === 'defense')[0].value = stats.filter(el => el.name === 'defense')[0].value + 1
                    break;
                case 2:
                    stats.filter(el => el.name === 'life')[0].value = stats.filter(el => el.name === 'life')[0].value + 1
                    break;
                default:
                    break;
            }
        }
        setStats(stats)
    }

    useEffect(()=> {
        handleSetStats()
    }, [props.opponent])

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
                    {opponentStats && opponentStats.map(el => {
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