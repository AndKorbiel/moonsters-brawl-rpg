import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useCreateOpponent } from '../hooks';
import { STAT_LABELS } from '../constants/statLabels';
import { PixelPanel } from '../components/ui/PixelPanel';
import { StatPlate } from '../components/ui/StatPlate';
import { colors, px } from '../theme/tokens';

const statIcons = {
  attack: 'icon-sword',
  defense: 'icon-shield',
  life: 'icon-heart',
} as const;

export function OpponentCard() {
  const { opponent } = useCreateOpponent();

  return (
    <PixelPanel
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: px(6),
        backgroundColor: colors.panel,
      }}
    >
      <Typography variant="h5" component="div" align="center">
        {opponent.name}
      </Typography>

      <Box
        aria-hidden="true"
        sx={{
          position: 'relative',
          width: '100%',
          height: px(5),
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            width: '100%',
            height: px(),
            backgroundColor: colors.goldDark,
            boxShadow: `0 ${px()} 0 ${colors.outline}`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            width: px(5),
            height: px(5),
            backgroundColor: colors.goldMid,
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
            transform: 'translateX(-50%)',
          },
        }}
      />

      <PixelPanel
        sx={{
          width: px(64),
          height: px(64),
          p: px(5),
          boxSizing: 'border-box',
          flexShrink: 0,
          background: `linear-gradient(to bottom, ${colors.portraitStart}, ${colors.portraitEnd})`,
        }}
      >
        <CardMedia
          component="img"
          image={opponent.image}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </PixelPanel>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: px(4),
          width: '100%',
        }}
      >
        {opponent.stats.map((stat) => (
          <StatPlate
            key={stat.name}
            icon={statIcons[stat.name]}
            label={`${STAT_LABELS[stat.name]}:`}
            value={stat.value}
            width={px(84)}
          />
        ))}
      </Box>
    </PixelPanel>
  );
}
