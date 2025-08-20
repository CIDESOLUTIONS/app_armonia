import { render, screen } from '@/__mocks__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '../page';

// Mock the translation hook


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
    
    // The title is "Armonía"
    const titleElement = screen.getByText('Armonía', { selector: 'h1.text-4xl' });

    expect(titleElement).toBeInTheDocument();
  });

  it('should render the primary call-to-action button', () => {
    render(<LandingPage />);

    // The button text is "Solicitar Demo"
    const ctaButton = screen.getByRole('button', {
        name: /Solicitar Demo/i,
    });

    expect(ctaButton).toBeInTheDocument();
  });
});
