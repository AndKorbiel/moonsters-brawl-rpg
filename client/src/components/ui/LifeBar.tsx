import Box from '@mui/material/Box';
import { colors, px } from '../../theme/tokens';

type LifeBarProps = {
  value: number;
  max: number;
  color: string;
};

const segmentCount = 16;

export function LifeBar({ value, max, color }: LifeBarProps) {
  const filledSegments =
    max > 0
      ? Math.min(
          segmentCount,
          Math.max(0, Math.round((segmentCount * Math.max(value, 0)) / max)),
        )
      : 0;

  return (
    <Box
      role="img"
      aria-label={`${value} of ${max} life points`}
      sx={{
        width: px(66),
        height: px(9),
        display: 'flex',
        gap: px(1),
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: `${px()} solid ${colors.outline}`,
        backgroundColor: colors.hpEmpty,
      }}
    >
      {Array.from({ length: segmentCount }, (_, index) => (
        <Box
          key={index}
          sx={{
            width: px(3),
            height: '100%',
            flexShrink: 0,
            backgroundColor:
              index < filledSegments ? color : colors.hpEmpty,
          }}
        />
      ))}
    </Box>
  );
}
