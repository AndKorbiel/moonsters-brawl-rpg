import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import {connect} from 'react-redux';
import {changeStatus} from "../redux/actions";

function MainMenu(props) {
    const handleChange = (value) => {
        props.changeStatus(value)
    }

    return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
                <MenuItem onClick={() => handleChange('New Game')}>
                    <h2>New game</h2>
                </MenuItem>
                <MenuItem>
                    <h2>Load game</h2>
                </MenuItem>
            </MenuList>
        </Paper>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        changeStatus: newStatus => dispatch(changeStatus(newStatus))
    }
}

export default connect(null, mapDispatchToProps)(MainMenu)