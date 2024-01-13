import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export function MainMenu({ options, action }) {
  return (
    <Box
      maxWidth="sm"
      className="centered text-centered main-menu"
      data-testid="main-menu"
    >
      <MenuList>
        {options.map((option) => {
          return (
            <MenuItem key={option.value}>
              <ListItemText>
                <Button variant="h2" onClick={() => action(option.value)}>
                  {option.label}
                </Button>
              </ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </Box>
  );
}
