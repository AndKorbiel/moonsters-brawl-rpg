import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LifeBar } from '../components/ui/LifeBar';
import { colors } from '../theme/tokens';

describe('LifeBar', () => {
  it.each([
    { value: 10, max: 20, filled: 8 },
    { value: 1, max: 20, filled: 1 },
    { value: -3, max: 20, filled: 0 },
    { value: 25, max: 20, filled: 16 },
    { value: 5, max: 0, filled: 0 },
  ])(
    'renders $filled filled segments for $value of $max life',
    ({ value, max, filled }) => {
      render(<LifeBar value={value} max={max} color={colors.hpFull} />);

      const bar = screen.getByRole('img', {
        name: `${value} of ${max} life points`,
      });
      const segments = Array.from(bar.children);
      const emptyColor = window.getComputedStyle(bar).backgroundColor;

      expect(segments).toHaveLength(16);
      expect(
        segments.filter(
          (segment) =>
            window.getComputedStyle(segment).backgroundColor !== emptyColor,
        ),
      ).toHaveLength(filled);
    },
  );

  it('uses the supplied color for its filled segments', () => {
    render(
      <>
        <LifeBar value={10} max={20} color={colors.hpFull} />
        <LifeBar value={10} max={20} color={colors.dangerText} />
      </>,
    );

    const [playerBar, opponentBar] = screen.getAllByRole('img');
    const playerSegment = playerBar.firstElementChild;
    const opponentSegment = opponentBar.firstElementChild;

    if (!playerSegment || !opponentSegment) {
      throw new Error('Expected both life bars to contain segments');
    }

    expect(window.getComputedStyle(playerSegment).backgroundColor).not.toBe(
      window.getComputedStyle(opponentSegment).backgroundColor,
    );
  });
});
