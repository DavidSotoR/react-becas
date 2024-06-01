// src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
  const login = async (sendData) => {
    var token = ''
    var role = 'admin'
    var loggedSuccess = false
    var body = {
      "email": sendData.email,
      "password":sendData.password
    }
    var resp
    try {
       resp = await axios.post('http://localhost:8000/api/auth/login', body)
       token = resp.data.access_token
       setIsLoggedIn(true);
       localStorage.setItem('role', 'admin')
       setRoleSession('admin')
       loggedSuccess = true
      
    } catch (error) {
      setIsLoggedIn(false);
      loggedSuccess = false
      var resp = error
      var message = error.response.data.error
      console.log(error.response.data.error);
      if (message === 'Unauthorized') {
        alert('Usuario no autorizado.')
      } else {
        alert('Error al enviar datos.')
      }
      
    }
    
    console.log(resp);
    localStorage.setItem('login', 'true');
    localStorage.setItem('token', token);
    setRoleSession(role)
    
    return loggedSuccess
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, roleSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
