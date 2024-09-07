// src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const APIURL = process.env.REACT_APP_API_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
  const [userSession, setUserSession] = useState(localStorage.getItem('user'))
  const [userID, setUserID] = useState(localStorage.getItem('id'))
  const login = async (sendData) => {
    var token = ''
    var role = ''
    var user = ''
    var id
    var loggedSuccess = false
    var body = {
      "login": sendData.login,
      "password":sendData.password
    }
    var resp
    try {
       resp = await axios.post(APIURL+'/login', body)
       console.log(resp);
       token = resp.data.access_token
       role = resp.data.data.perfil.nombre
       user = resp.data.data.email
       id = resp.data.data.id
       console.log(user);
       setIsLoggedIn(true);
       localStorage.setItem('role', role)
       localStorage.setItem('user', user)
       localStorage.setItem('id', id)
       setRoleSession(role)
       setUserSession(user)
       setUserID(id)
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
    window.location.replace('/')
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,userSession, roleSession,userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
