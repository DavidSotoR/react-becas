import React from 'react';
import Navbar from '../NavBar/NavBar';

const NotFound = () => {
  return (
    <div>
      <Navbar></Navbar>
      <h1>404 - Not Found</h1>
      <p>La página que estás buscando no existe.</p>
    </div>
  );
}

export default NotFound;