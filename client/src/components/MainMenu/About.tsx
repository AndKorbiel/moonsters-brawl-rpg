import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export function About() {
  return (
    <Box sx={{ maxWidth: 900 }} className="centered text-centered">
      <Card className="padlrextra">
        <h1>Game rules</h1>

        <Typography variant="subtitle1" gutterBottom>
          <b>Attack points</b> are responsible for the amount of damage a
          monster can inflict. Damage can be in range - from Attack points
          multiplied by 1 to Attack points multiplied by 1.4. In example: if
          your Attack is equal 10, than possible damage will be from range: 10
          (10x1) to 14 (10x1.4).
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <b>Defence points</b> determine the chance of blocking the attack. The
          chance is calculated as Defence divided by Defence plus incoming
          damage. For example, 5 Defence against 10 damage gives a 33% chance to
          block: 5 / (5 + 10) = 0.33.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <b>Life points</b> determine how much damage you can take. The player
          which life points gets to 0 or less, losses the brawl.
        </Typography>
      </Card>
    </Box>
  );
}
