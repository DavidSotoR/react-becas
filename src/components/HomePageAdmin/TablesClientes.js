import React from 'react';

function TablaFolios({ folios }) {
  return (
    <div className="mt-4">
      <table className="table">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Familia</th>
            <th>Asignado</th>
          </tr>
        </thead>
        <tbody className='numeros'>
          {folios.map((folio) => (
            <tr key={folio.folio}>
              <td>{folio.folio}</td>
              <td>{folio.familia}</td>
              <td>{folio.asignado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaFolios;
