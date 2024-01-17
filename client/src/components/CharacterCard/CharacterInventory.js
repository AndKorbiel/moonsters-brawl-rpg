import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export const CharacterInventory = ({ character, handleDropItem }) => {
  const emptySpaceInInventory = [];
  for (let n = character.items.length; n <= 2; n++) {
    emptySpaceInInventory.push(
      <Grid item xs={12} lg={4} className="inventory-box" key={n} />,
    );
  }

  return (
    <CardContent id="character-inventory">
      <Typography gutterBottom variant="h5" component="div">
        Inventory
      </Typography>

      <Grid container spacing={2} className="inventory-cont">
        {character.items.map((item) => (
          <Grid item xs={4} className="inventory-box" key={item.id}>
            <CardMedia component="img" image={item.image} />
            {character.isEditing && (
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<HighlightOffIcon />}
                  onClick={() => handleDropItem(item)}
                >
                  Drop item
                </Button>
              </CardActions>
            )}
          </Grid>
        ))}
        {emptySpaceInInventory}
      </Grid>
    </CardContent>
  );
};
