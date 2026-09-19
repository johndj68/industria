/**
 * drag.js — Sistema de overlay visual para drag & drop
 *
 * PROBLEMA RAIZ:
 * No Linux (Firefox e Chrome/Wayland), o ghost image nativo do HTML5 DnD
 * frequentemente não aparece: o cursor fica como seta, o item fica no lugar,
 * mas o drop ainda funciona. Isso é um bug da plataforma, não do código.
 *
 * SOLUÇÃO:
 * 1. Suprimir o ghost nativo com uma imagem transparente 1x1
 * 2. Criar um clone do item (position: fixed, pointer-events: none) que
 *    segue o cursor via evento 'drag' no document
 *
 * USO NOS SIMULADORES:
 *   import { iniciarOverlayDrag, encerrarOverlayDrag, moverOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';
 *
 *   handleDragStart(item, e) {
 *     ...
 *     e.dataTransfer.setDragImage(IMAGEM_DRAG_VAZIA, 0, 0); // suprime ghost nativo
 *     iniciarOverlayDrag(e.currentTarget);                  // cria overlay visual
 *   }
 *
 *   handleDragEnd() {
 *     encerrarOverlayDrag();   // remove overlay
 *   }
 *
 *   // No componente, chamar useDragOverlay() para mover o overlay com o cursor
 */

// ─── Imagem 1×1 transparente ─────────────────────────────────────────────────
// Passada para setDragImage para suprimir completamente o ghost nativo do browser
export const IMAGEM_DRAG_VAZIA = (() => {
  if (typeof Image === 'undefined') return null;
  const img = new Image();
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  return img;
})();


// ─── Overlay visual customizado ───────────────────────────────────────────────

/** Referência ao clone visual que segue o cursor durante o drag */
let _overlay     = null;
/** Deslocamento X de onde o usuário clicou dentro do elemento */
let _clickOffsetX = 0;
/** Deslocamento Y de onde o usuário clicou dentro do elemento */
let _clickOffsetY = 0;

/**
 * Cria um clone visual do elemento arrastado e o anexa ao body.
 * O clone segue o cursor via `moverOverlayDrag`.
 *
 * @param {HTMLElement} elemento  - Elemento sendo arrastado (e.currentTarget)
 * @param {number}      clickX   - Posição X do clique DENTRO do elemento (e.clientX - rect.left)
 * @param {number}      clickY   - Posição Y do clique DENTRO do elemento (e.clientY - rect.top)
 *
 * Os offsets garantem que o item aparece exatamente onde o usuário clicou,
 * não deslocado para cima ou para o lado (bug da ancoragem fixa).
 */
export function iniciarOverlayDrag(elemento, clickX = 0, clickY = 0) {
  encerrarOverlayDrag(); // limpa qualquer overlay anterior

  const clone = elemento.cloneNode(true);
  _clickOffsetX = clickX;
  _clickOffsetY = clickY;

  /*
   * CRÍTICO: preservar as dimensões exatas do elemento no layout original.
   *
   * Problema: quando o elemento está em um grid/flex com 1fr ou fill,
   * o e.currentTarget tem largura da célula (ex: 200px), mas ao clonar
   * com position:fixed o clone encolhe para seu conteúdo natural (~58px).
   * O offset de clique foi calculado relativo a 200px, mas o clone tem 58px
   * → o SVG aparece muito à esquerda do cursor.
   *
   * Solução: fixar width e height iguais ao elemento original antes de
   * qualquer transform ou animação.
   */
  const { offsetWidth, offsetHeight } = elemento;

  Object.assign(clone.style, {
    position:      'fixed',
    top:           '-9999px',
    left:          '-9999px',
    width:         `${offsetWidth}px`,   // mantém largura da célula do grid/flex
    height:        `${offsetHeight}px`,  // mantém altura do elemento original
    zIndex:        '99999',
    pointerEvents: 'none',   // nunca intercepta eventos do mouse/drop
    opacity:       '0.88',
    transform:     'none',
    animation:     'none',
    transition:    'none',
    margin:        '0',
    cursor:        'grabbing',
    userSelect:    'none',
    boxSizing:     'border-box',
  });

  // Remove transforms e animations de todos os filhos (SVGs, spans, etc.)
  clone.querySelectorAll('*').forEach(child => {
    child.style.animation  = 'none';
    child.style.transition = 'none';
    child.style.transform  = 'none';
  });

  document.body.appendChild(clone);
  _overlay = clone;
}

/**
 * Move o overlay para acompanhar o cursor durante o drag.
 * Chamado automaticamente pelo hook useDragOverlay via evento 'drag'.
 *
 * @param {number} clientX - e.clientX do evento drag
 * @param {number} clientY - e.clientY do evento drag
 */
export function moverOverlayDrag(clientX, clientY) {
  if (!_overlay) return;
  // Firefox envia (0, 0) no último evento drag antes do dragend — ignorar
  if (clientX === 0 && clientY === 0) return;

  // Posiciona o overlay de forma que o cursor apareça exatamente
  // no ponto onde o usuário clicou dentro do item original
  _overlay.style.left = `${clientX - _clickOffsetX}px`;
  _overlay.style.top  = `${clientY - _clickOffsetY}px`;
}

/**
 * Remove o overlay visual do DOM e limpa o estado interno.
 *
 * DEVE ser chamado em:
 *   - handleDragEnd   → quando o drag termina (drop ou cancelamento)
 *   - handleDrop      → quando o drop é bem-sucedido (evita overlay preso
 *                        caso o dragend não dispare após o React re-renderizar)
 */
export function encerrarOverlayDrag() {
  if (_overlay && _overlay.parentNode) {
    _overlay.parentNode.removeChild(_overlay);
  }
  _overlay      = null;
  _clickOffsetX = 0;
  _clickOffsetY = 0;
}
