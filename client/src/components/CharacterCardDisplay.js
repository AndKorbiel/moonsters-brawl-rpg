// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React from "react";

export default function CharacterCardDisplay(props) {
  let emptySpaceInInventory = [];
  for (let n = props.character.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(<Grid item xs={12} lg={4} className="inventory-box" key={n} />)
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        {props.character.isEditing ?
          <TextField
            error={props.validation.name}
            helperText={!props.validation.name ? "" : "Name be at least 2 characters long"}
            defaultValue={props.character.name}
            id="outlined-basic"
            label="Your name"
            onChange={e => props.handleNameChange(e)} variant="outlined"
          />
          :
          <Typography gutterBottom variant="h5" component="div">
            {props.character.name}
          </Typography>
        }

      </CardContent>
      <CardMedia
        component="img"
        height="140"
        image={props.character.image}
      />
      <CardActions className="stats">
        <ul>
          <li>
            <Typography variant="h6">
              Level: {props.character.level}
            </Typography>
          </li>
          <li>
            <Typography variant="h6">
              Gold: {props.character.gold}
            </Typography>
          </li>
          <li>
            <Typography variant="h6">
              Points to spend: {props.points}
            </Typography>
          </li>
          {props.character.stats.map(el => {
            return (
              <li key={el.name}>
                {props.character.isEditing ?
                  <Button
                    variant="outlined"
                    name={el.name}
                    onClick={e => props.handleStatsChange(e, 'decrement')}
                  >-</Button>
                  : ''
                }
                <Typography variant="h6">
                  {el.name}: {props.character.isEditing ? props.stats.filter(item => item.name === el.name)[0].value : el.value}
                </Typography>
                {props.character.isEditing ?
                  <Button
                    variant="outlined"
                    name={el.name}
                    onClick={e => props.handleStatsChange(e, 'increment')}
                  >+</Button>
                  : ''
                }
              </li>
            )
          })}
        </ul>
      </CardActions>
      {props.character.isEditing ?
        <Button variant="contained" onClick={() => props.handleSave()}>Save</Button>
        : props.statusCode === 1 ?
          <Button variant="contained" onClick={() => props.handleEditMode(true)}>Edit</Button>
          : ''
      }
      {!props.character.isEditing && props.statusCode === 1 && props.points === 0 ?
        <Button variant="contained" color="error" onClick={() => props.setStatusCode(2)}>Start game</Button>
        : ''
      }
      <hr />
      <CardContent id="character-inventory">
        <Typography gutterBottom variant="h5" component="div">
          Inventory
        </Typography>
        <Grid container spacing={4} className="inventory-cont">
          {props.character.items.map(item => {
            return (
              <Grid item xs={12} lg={4} className="inventory-box" key={item.id}>
                <CardMedia
                  component="img"
                  image={item.image}
                />
                {props.character.isEditing ?
                  <CardActions>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => props.handleDropItem(item)}>
                      Drop item
                    </Button>
                  </CardActions>
                  : ''
                }
              </Grid>
            )
          })}
          {emptySpaceInInventory}
        </Grid>
      </CardContent>
    </Card>
  )
}