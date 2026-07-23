import '@testing-library/jest-dom/extend-expect';

// Basic mocks for Next navigation helpers used across components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => '/',
}));
