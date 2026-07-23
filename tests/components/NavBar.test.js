import { render, screen } from '@testing-library/react';
import NavBar from '@/components/NavBar';

// Mock supabase client used by NavBar
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(async () => ({ data: { user: { id: 'user-1' } } })),
      signOut: jest.fn(async () => ({})),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { coin_balance: 100 } }),
        }),
      }),
    }),
  },
}));

jest.mock('next/link', () => ({ __esModule: true, default: ({ href, children }) => <a href={href}>{children}</a> }));

describe('NavBar', () => {
  it('renders links and balance when user present', async () => {
    render(<NavBar />);

    expect(await screen.findByText(/100 SC/)).toBeInTheDocument();
    expect(screen.getAllByText(/Dashboard/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sign out/)).toBeInTheDocument();
  });
});
