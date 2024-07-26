import React from 'react';

const ResaltarTexto = ({ texto, reslatar }) => {
  if (!reslatar) return <span>{texto}</span>;

  const parts = texto.split(new RegExp(`(${reslatar})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === reslatar.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default ResaltarTexto;