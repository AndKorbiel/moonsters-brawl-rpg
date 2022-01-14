import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MainMenu(props) {
    return (
        <Box maxWidth="sm" className="centered text-centered">
            <MenuList>
                {props.options.map(element => {
                    return (
                        <MenuItem key={element.value}>
                            <ListItemText>
                                <Typography variant="h3" onClick={()=> props.action(element.value)}>
                                    {element.label}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    )
                })}
            </MenuList>
        </Box>
    )
}