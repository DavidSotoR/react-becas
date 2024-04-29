import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import Login from './components/Login/login';
import { useState } from 'react';
import { Route, BrowserRouter as Router,Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';
import FormBP2 from './components/Formularios/ESEBP2/FormBP2';
import FormBP3 from './components/Formularios/ESEBP3/FormBP3';
import FormBP7 from './components/Formularios/ESEBP7/FormBP7';

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
          <Route path="/form-1" element={<FormBP2 />} />
          <Route path="/form-2" element={<FormBP3 />} />
          <Route path="/form-3" element={<FormBP7 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;