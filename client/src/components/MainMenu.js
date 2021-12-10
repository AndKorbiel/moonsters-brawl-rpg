import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const options = [
    {value: 1, label: "New Game"},
    {value: 2, label: "Save Game"},
    {value: 3, label: "Load Game"},
    {value: 4, label: "Quit"}
]

export default function MainMenu(props) {
    return (
        <Box maxWidth="sm" className="centered text-centered">
            <MenuList>
                {options.map(element => {
                    return (
                        <MenuItem>
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