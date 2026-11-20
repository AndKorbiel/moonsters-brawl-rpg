import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

export function About() {
  return (
    <Box sx={{ maxWidth: 900 }} className="centered text-centered">
      <Card className="padlrextra">
        <h1>Game rules</h1>

        <Typography variant="subtitle1" gutterBottom>
          <b>Attack points</b> determine how much damage an attacker can deal.
          The minimum damage is the Attack value rounded up; the maximum is 1.4
          times the Attack value, rounded down. Each hit deals a random
          whole-number amount between those limits, inclusive. For example, an
          attacker with 10 Attack deals between 10 and 14 damage.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <b>Defense points</b> determine the chance of blocking an incoming
          hit. The defender's block chance is Defense divided by Defense plus
          incoming damage. For example, 5 Defense against 10 damage gives about
          a 33% chance to block: 5 / (5 + 10) = 0.33.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <b>Life points</b> determine how much damage the player or monster can
          take. The player or monster whose Life reaches 0 or less loses the
          brawl.
        </Typography>
      </Card>
    </Box>
  );
}
