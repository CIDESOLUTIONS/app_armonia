import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PortalSelector from '../page'; // Renamed for clarity

// Mock the router
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

// Mock the Header component to avoid its complex dependencies
vi.mock('@/components/layout/header', () => ({
  Header: () => <header>Mocked Header</header>,
}));

describe('Portal Selector Page', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  it('should render the main title', () => {
    render(<PortalSelector />);
    expect(screen.getByRole('heading', { name: /Seleccionar Portal/i })).toBeInTheDocument();
  });

  it('should call router.push with the correct admin URL when the admin card is clicked', () => {
    render(<PortalSelector />);
    const adminButton = screen.getByTestId('portal-admin-button');
    fireEvent.click(adminButton);
    expect(mockRouterPush).toHaveBeenCalledWith('/es/login?portal=admin');
  });
});