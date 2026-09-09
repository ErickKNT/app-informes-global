import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroupSupervisorsCard } from './GroupSupervisorsCard';

describe('GroupSupervisorsCard organism', () => {
  const overseer = {
    name: 'Carlos Méndez',
    role: 'Encargado de Grupo · Anciano',
  };

  const assistant = {
    name: 'Roberto Silva',
    role: 'Auxiliar de Grupo · Siervo Min.',
  };

  it('renderiza nombres y roles de los supervisores', () => {
    render(
      <GroupSupervisorsCard
        groupName="Grupo 1 · Los Olivos"
        overseer={overseer}
        assistant={assistant}
        location="Salón B · Zona Norte"
        schedule="Sábados 09:30 AM"
      />
    );

    expect(screen.getByText('Grupo 1 · Los Olivos')).toBeInTheDocument();
    expect(screen.getByText('Carlos Méndez')).toBeInTheDocument();
    expect(screen.getByText('Encargado de Grupo · Anciano')).toBeInTheDocument();
    expect(screen.getByText('Roberto Silva')).toBeInTheDocument();
    expect(screen.getByText('Auxiliar de Grupo · Siervo Min.')).toBeInTheDocument();
    expect(screen.getByText('Salón B · Zona Norte')).toBeInTheDocument();
    expect(screen.getByText('Sábados 09:30 AM')).toBeInTheDocument();
  });
});
