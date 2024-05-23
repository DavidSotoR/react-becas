import React, { useState } from 'react';

const SpinnerCharge = () => {
  

  return (
    <div className='d-flex justify-content-center align-item-center'>
        <div className="spinner-border" style="{{ width: 3rem, height: 3rem }}" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
    </div>
  );
};

export default SpinnerCharge;