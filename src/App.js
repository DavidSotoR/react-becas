import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import Login from './components/login';
import { useState } from 'react';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sendLogin(); // Llamar a sendLogin() cuando se realiza el inicio de sesión
  };

  const sendLogin = () => {
    console.log("Esta es el login");
  };

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;