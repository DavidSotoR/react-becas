// src/context/AuthContext.js
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import React, { createContext, useState } from 'react';
import ToastHeader from '../../node_modules/react-bootstrap/esm/ToastHeader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const APIURL = process.env.REACT_APP_API_URL;

  const [ showAlertContext, setShowAlertContext ] = useState(false)
  const [ dataAlertContext, setDataAlertContext ] = useState({ type: 'warning', title: 'Error API', message: 'Error al enviar datos.' })
  
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
  const [userSession, setUserSession] = useState(localStorage.getItem('user'))
  const [userID, setUserID] = useState(localStorage.getItem('id'))
  const [ userActive, setUserActive ] = useState(null)
  const [ ua, setUA ] = useState(false)
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
       var data = resp.data.data
       var famSE = resp.data.se
       console.log(data);
       if (data.id_perfil == 6) {
        if (famSE) {
          localStorage.setItem("se", famSE.id);
        }
       }
       setUserActive(data.password_temporal === null ? true : false)
       localStorage.setItem('ua', data.password_temporal === null ? true : false)
       setUA(data.password_temporal === null ? true : false)
       setIsLoggedIn(true);
       localStorage.setItem('role', role)
       localStorage.setItem('user', user)
       localStorage.setItem('id', id)
       localStorage.setItem('name', data.name)
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
        mostrarAlerta({ type: 'warning', title: 'Error Autenticación', message: 'Usuario no esta autorizado.' })
        //alert('Usuario no autorizado.')
      } else {
        mostrarAlerta({ type: 'warning', title: 'Error API', message: 'Error al enviar datos.' })
        //alert('Error al enviar datos.')
      }
      
    }
    return loggedSuccess
  };

  const mostrarAlerta = (data = { type: 'warning', title: 'Sin Titulo', message: 'No hay mensaje para mostrar.' }) => {
    
    return (
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        <Toast bg={ data.type }>
          <Toast.Header >
            <strong className="text-white">{ data.title }</strong>
          </Toast.Header>
          <Toast.Body >
            <p className="text-white">{ data.message }</p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    )
  }

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.replace('/')
  };

  const execShowAlert = (data) =>{
    setShowAlertContext(true)
    setDataAlertContext(data)
    mostrarAlerta(data)
  }

  const execHideAlert = (data) =>{
    setShowAlertContext(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn,userSession, roleSession,userID, 
    userActive, login, logout, ua, 
    showAlertContext, execShowAlert, execHideAlert }}>
      {children}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        <Toast 
         show={showAlertContext}
         onClose={execHideAlert}
         bg={dataAlertContext.type}
         delay={3000}
         autohide>
          <Toast.Header>
            <strong>{ dataAlertContext.title }</strong>
          </Toast.Header>
          <Toast.Body>
            <p>{ dataAlertContext.message }</p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </AuthContext.Provider>
  );
};
