import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App root with complete navigation, auth and Atomic Design pages', () => {
  it('inicia por defecto en el Panel General con sesión activa de David Morales', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /bienvenido, david morales/i })).toBeInTheDocument();
    expect(screen.getByText('Cierre oficial de ciclo mensual')).toBeInTheDocument();
  });

  it('permite navegar hacia todas las secciones, incluida Asistencia a Reuniones', async () => {
    render(<App />);

    const reportNavButton = screen.getByRole('button', { name: /mi informe mensual/i });
    await userEvent.click(reportNavButton);
    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();

    const groupsNavButton = screen.getByRole('button', { name: /grupos de servicio/i });
    await userEvent.click(groupsNavButton);
    expect(screen.getByRole('heading', { name: /grupos de predicación y servicio/i })).toBeInTheDocument();

    const attendanceNavButton = screen.getByRole('button', { name: /asistencia a reuniones/i });
    await userEvent.click(attendanceNavButton);
    expect(screen.getByRole('heading', { name: /asistencia a las reuniones/i })).toBeInTheDocument();

    const consolidatedNavButton = screen.getByRole('button', { name: /reportes consolidados/i });
    await userEvent.click(consolidatedNavButton);
    expect(screen.getByRole('heading', { name: /reportes y análisis de servicio/i })).toBeInTheDocument();

    const publisherCardsNavButton = screen.getByRole('button', { name: /tarjetas de publicador/i });
    await userEvent.click(publisherCardsNavButton);
    expect(screen.getByRole('heading', { name: /tarjetas de publicador/i })).toBeInTheDocument();
  });

  it('permite cerrar sesión y mostrar la pantalla de Login', async () => {
    render(<App />);

    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await userEvent.click(logoutButton);

    expect(screen.getByRole('heading', { name: /servicio & registro/i })).toBeInTheDocument();
    expect(screen.getByText('David Morales')).toBeInTheDocument();
  });

  it('al iniciar sesión como Mateo González (publicador), solo tiene acceso a Mi Informe Mensual', async () => {
    render(<App />);

    // Cerrar sesión
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await userEvent.click(logoutButton);

    // Iniciar sesión como Mateo González (Publicador)
    const mateoButton = screen.getByText('Mateo González');
    await userEvent.click(mateoButton);

    // Debe mostrar la vista de Mi Informe Mensual
    expect(screen.getByRole('heading', { name: /mi registro de servicio/i })).toBeInTheDocument();

    // Solo debe haber 1 botón de navegación: "Mi Informe Mensual"
    expect(screen.getByRole('button', { name: /mi informe mensual/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /panel general/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /grupos de servicio/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /asistencia a reuniones/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reportes consolidados/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /tarjetas de publicador/i })).not.toBeInTheDocument();
  });

  it('al iniciar sesión como Carlos Méndez (encargado), solo accede a Mi Informe y Grupos de Servicio', async () => {
    render(<App />);

    // Cerrar sesión
    const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
    await userEvent.click(logoutButton);

    // Iniciar sesión como Carlos Méndez (Encargado)
    const carlosButton = screen.getByText('Carlos Méndez');
    await userEvent.click(carlosButton);

    // Solo debe tener acceso a Mi Informe Mensual y Grupos de Servicio
    expect(screen.getByRole('button', { name: /mi informe mensual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grupos de servicio/i })).toBeInTheDocument();

    // Las áreas restringidas NO deben aparecer
    expect(screen.queryByRole('button', { name: /panel general/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /asistencia a reuniones/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reportes consolidados/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /tarjetas de publicador/i })).not.toBeInTheDocument();

    // Al navegar a Grupos de Servicio, solo ve su grupo y no puede crear grupos
    const groupsNav = screen.getByRole('button', { name: /grupos de servicio/i });
    await userEvent.click(groupsNav);
    expect(screen.getByRole('heading', { name: /grupos de predicación y servicio/i })).toBeInTheDocument();
    expect(screen.getByText(/mi grupo asignado/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /crear grupo/i })).not.toBeInTheDocument();
  });
});
