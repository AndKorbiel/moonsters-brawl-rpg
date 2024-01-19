import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

import { useDispatch } from 'react-redux';
import { setStatusCode } from '../redux/actions/game';
import React from 'react';
import { Box } from '@mui/material';
import { MenuOption } from '../types';

export function MainMenu({ options }: { options: MenuOption[] }) {
  const dispatch = useDispatch();

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
                <Button
                  variant="text"
                  onClick={() => dispatch(setStatusCode(option.value))}
                >
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
