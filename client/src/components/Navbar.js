import { Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';
import { connect } from 'react-redux';
import {changeStatus} from "../redux/actions";

function Navbar(props) {
    return (
            <div className='navbar'>
                <Container >
                    <Grid container spacing={2}>
                        <Grid item={true} xs={8} >
                            <a onClick={props.changeStatus} className={"menu-cont"}>
                                <MenuIcon /><h2>MENU</h2>
                            </a>
                        </Grid>
                        <Grid item={true} xs={4}>
                            <h2>Current status is: {props.status}</h2>
                        </Grid>
                    </Grid>
                </Container>
            </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        changeStatus: () => dispatch(changeStatus('In Main Menu'))
    }
}

export default connect(null, mapDispatchToProps)(Navbar);