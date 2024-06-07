// src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
  const [userSession, setUserSession] = useState(localStorage.getItem('user'))
  const login = async (sendData) => {
    var token = ''
    var role = ''
    var user = ''
    var loggedSuccess = false
    var body = {
      "email": sendData.email,
      "password":sendData.password
    }
    var resp
    try {
       resp = await axios.post('http://localhost:8000/api/auth/login', body)
       console.log(resp);
       token = resp.data.access_token
       role = resp.data.data.perfil.nombre
       user = resp.data.data.email
       console.log(user);
       setIsLoggedIn(true);
       localStorage.setItem('role', role)
       localStorage.setItem('user', user)
       setRoleSession(role)
       setUserSession(user)
       loggedSuccess = true
       localStorage.setItem('login', 'true');
       localStorage.setItem('token', token);
      
    } catch (error) {
      setRoleSession('')
      setIsLoggedIn(false);
      loggedSuccess = false
      var resp = error
      console.log(resp);
      /* var message = error.response.data.error
      console.log(error.response.data.error); */
      if (resp === 'Unauthorized') {
        alert('Usuario no autorizado.')
      } else {
        alert('Error al enviar datos.')
      }
      
    }
    
    console.log(resp);
    
    return loggedSuccess
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,userSession, roleSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
