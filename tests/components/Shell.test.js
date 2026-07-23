import { render, screen } from '@testing-library/react';
import Shell from '@/components/Shell';

jest.mock('@/components/NavBar', () => () => <div>NavBarMock</div>);

describe('Shell', () => {
  it('renders title, subtitle and children', () => {
    render(
      <Shell title="Hello" subtitle="sub">
        <div>child</div>
      </Shell>
    );

    expect(screen.getByText('NavBarMock')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('sub')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
