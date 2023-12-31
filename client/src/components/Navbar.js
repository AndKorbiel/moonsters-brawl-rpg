import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Navbar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Moonster Brawl RPG
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Status: {props.status}
          </Typography>
          {props.status !== 2 ? <Button color="inherit" onClick={() => props.action(0)}>MENU</Button> : ''}
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}