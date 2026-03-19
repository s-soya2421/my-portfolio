import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import { ChallengesSection } from './challenges';

const dictionary = getDictionary('ja');

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ dictionary }),
}));

const items = [
  { title: 'Challenge One', description: 'First challenge description', status: 'Done' },
  { title: 'Challenge Two', description: 'Second challenge description' },
];

describe('ChallengesSection', () => {
  it('renders the section heading from dictionary', () => {
    render(<ChallengesSection items={items} />);

    expect(
      screen.getByRole('heading', { name: dictionary.sections.challengesTitle })
    ).toBeInTheDocument();
  });

  it('renders all challenge item titles and descriptions', () => {
    render(<ChallengesSection items={items} />);

    expect(screen.getByText('Challenge One')).toBeInTheDocument();
    expect(screen.getByText('First challenge description')).toBeInTheDocument();
    expect(screen.getByText('Challenge Two')).toBeInTheDocument();
    expect(screen.getByText('Second challenge description')).toBeInTheDocument();
  });

  it('renders the provided status badge', () => {
    render(<ChallengesSection items={items} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('uses dictionary challenges label as fallback status when not provided', () => {
    render(<ChallengesSection items={items} />);

    // The text appears both in the SectionHeader eyebrow and as the fallback status
    const matches = screen.getAllByText(dictionary.sections.challenges);
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('renders zero-padded index numbers', () => {
    render(<ChallengesSection items={items} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
  });
});
