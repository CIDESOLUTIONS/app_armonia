import { render, screen } from '@/__mocks__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '../page';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('LandingPage', () => {
  it('should render the main hero section title', () => {
    render(<LandingPage />);
    
    // The title is "hero.title" (translation key)
    const titleElement = screen.getByText('hero.title', { selector: 'h1.text-4xl' });

    expect(titleElement).toBeInTheDocument();
  });

  it('should render the primary call-to-action button', () => {
    render(<LandingPage />);

    // The button text is "hero.ctaPrimary" (translation key)
    const ctaButton = screen.getByRole('button', {
        name: /hero.ctaPrimary/i,
    });

    expect(ctaButton).toBeInTheDocument();
  });
});
