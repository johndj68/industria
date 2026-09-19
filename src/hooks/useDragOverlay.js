/**
 * useDragOverlay.js — Hook para mover o overlay visual durante o drag
 *
 * Registra listeners no document para os eventos 'drag' e 'dragend',
 * que são disparados pelo browser para QUALQUER elemento arrastado na página.
 * Isso dispensa modificar o JSX de cada item individual.
 *
 * Deve ser chamado UMA vez no componente raiz de cada simulador.
 *
 * Uso:
 *   import { useDragOverlay } from '../hooks/useDragOverlay';
 *   // dentro do componente:
 *   useDragOverlay();
 */
import { useEffect } from 'react';
import { moverOverlayDrag, encerrarOverlayDrag } from '../utils/drag';

export function useDragOverlay() {
  useEffect(() => {
    // O evento 'drag' dispara repetidamente enquanto o usuário arrasta,
    // fornecendo a posição atual do cursor para mover o overlay
    const aoArrastar = (e) => moverOverlayDrag(e.clientX, e.clientY);

    // O evento 'dragend' dispara quando o usuário solta (drop ou cancela)
    const aoTerminar = () => encerrarOverlayDrag();

    document.addEventListener('drag',    aoArrastar);
    document.addEventListener('dragend', aoTerminar);

    return () => {
      document.removeEventListener('drag',    aoArrastar);
      document.removeEventListener('dragend', aoTerminar);
    };
  }, []); // [] = registra uma vez, remove no unmount
}
