import React from 'react';

const ZonaDrop = ({ id, onDrop, onDragOver, onDragEnter, gap = 4, children }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}
    onDrop={e => onDrop(id, e)}
    onDragOver={onDragOver}
    onDragEnter={onDragEnter}
  >
    {children}
  </div>
);

export default ZonaDrop;
