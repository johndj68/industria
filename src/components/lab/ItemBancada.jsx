import React from 'react';

const ItemBancada = ({ id, className = '', draggable = true, onDragStart, onDragEnd, children }) => (
  <div
    className={`item-drag ${className}`}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
    draggable={draggable}
    onDragStart={e => onDragStart(id, e)}
    onDragEnd={onDragEnd}
  >
    {children}
  </div>
);

export default ItemBancada;
