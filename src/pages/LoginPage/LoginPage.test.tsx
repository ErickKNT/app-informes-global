import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';

describe('LoginPage', () => {
  it('renderiza el título, campos de login y botones de acceso de prueba', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: /servicio & registro/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByText('David Morales')).toBeInTheDocument();
    expect(screen.getByText('Carlos Méndez')).toBeInTheDocument();
    expect(screen.getByText('Mateo González')).toBeInTheDocument();
  });

  it('permite alternar la visibilidad de la contraseña', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: /mostrar clave/i });
    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('permite iniciar sesión con acceso rápido demo', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const demoButton = screen.getByText('David Morales');
    await userEvent.click(demoButton);
    // Clicked demo button without throwing error
  });
});
