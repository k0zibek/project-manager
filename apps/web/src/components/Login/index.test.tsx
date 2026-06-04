import { describe, expect, it, vi } from 'vitest';

import { Login } from 'components/Login';
import { renderWithProviders } from 'test/renderWithProviders';

vi.mock('hooks/ToasterProvider/useToasterProvider', () => ({
  useToasterContext: () => ({ toaster: null }),
}));

describe('Login', () => {
  it('renders login form', () => {
    const { getByRole, getByText } = renderWithProviders(<Login />, '/login');

    expect(getByText('Вход')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });
});
