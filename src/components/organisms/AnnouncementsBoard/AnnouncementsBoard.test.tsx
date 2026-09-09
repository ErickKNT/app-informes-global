import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnnouncementsBoard } from './AnnouncementsBoard';
import { announcementsService } from '@/services/announcementsService';

describe('AnnouncementsBoard organism', () => {
  beforeEach(() => {
    announcementsService.resetDefaults();
  });

  it('renderiza título, contador y los anuncios por defecto', () => {
    render(<AnnouncementsBoard canManage={false} />);

    expect(screen.getByRole('heading', { name: /tablón de anuncios/i })).toBeInTheDocument();
    expect(screen.getByText(/visita del superintendente de circuito/i)).toBeInTheDocument();
    expect(screen.getByText(/aseo y mantenimiento del salón/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /nuevo anuncio/i })).not.toBeInTheDocument();
  });

  it('muestra el botón Nuevo Anuncio si canManage es true y permite crear uno nuevo', async () => {
    render(<AnnouncementsBoard canManage={true} />);

    const newBtn = screen.getByRole('button', { name: /nuevo anuncio/i });
    expect(newBtn).toBeInTheDocument();
    await userEvent.click(newBtn);

    expect(screen.getByRole('heading', { name: /publicar nuevo anuncio/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/visita del superintendente de circuito/i);
    await userEvent.type(titleInput, 'Asamblea de Circuito Especial');

    const contentInput = screen.getByPlaceholderText(/detalles sobre el anuncio/i);
    await userEvent.type(contentInput, 'La asamblea será el próximo mes.');

    const submitBtn = screen.getByRole('button', { name: /publicar anuncio/i });
    await userEvent.click(submitBtn);

    expect(screen.getByText('Asamblea de Circuito Especial')).toBeInTheDocument();
  });

  it('permite eliminar un anuncio cuando canManage es true', async () => {
    render(<AnnouncementsBoard canManage={true} />);

    expect(screen.getByText(/visita del superintendente de circuito/i)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', {
      name: /eliminar anuncio visita del superintendente de circuito/i,
    });
    await userEvent.click(deleteBtn);

    expect(screen.queryByText(/visita del superintendente de circuito/i)).not.toBeInTheDocument();
  });
});
