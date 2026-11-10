// src/context/AuthContext.js
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/ApiService';
import { tokenExpiresAt, isCurrentApiRequest } from '../services/session';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const APIURL = process.env.REACT_APP_API_URL;

  const [ showAlertContext, setShowAlertContext ] = useState(false)
  const [ dataAlertContext, setDataAlertContext ] = useState({ type: 'warning', title: 'Error API', message: 'Error al enviar datos.' })
  
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
  const [documentoDigital, setDocumentoDigital] = useState(localStorage.getItem('dd'))
  const [userSession, setUserSession] = useState(localStorage.getItem('user'))
  const [userID, setUserID] = useState(localStorage.getItem('id'))
  const [ userActive, setUserActive ] = useState(null)
  const [ ua, setUA ] = useState(false)
  const closingSession = useRef(false);
  const login = async (sendData) => {
    var token = ''
    var role = ''
    var user = ''
    var dd ;
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
       dd = 0; //DOCUMENTACION DIGITAL
       token = resp.data.access_token
       role = resp.data.data.perfil.nombre
       user = resp.data.data.email
       id = resp.data.data.id
       var data = resp.data.data
       var famSE = resp.data.se
       console.log(data);
       if (data.id_perfil == 6) {
        if (famSE) {
          dd = resp.data.se.cliente.documentacion_digital;
          localStorage.setItem("se", famSE.id);
        }
       }
       setUserActive(data.password_temporal === null ? true : false)
       localStorage.setItem('ua', data.password_temporal === null ? true : false)
       setUA(data.password_temporal === null ? true : false)
       setIsLoggedIn(true);
       localStorage.setItem('role', role)
       localStorage.setItem('dd', dd)
       localStorage.setItem('user', user)
       localStorage.setItem('id', id)
       localStorage.setItem('name', data.name)
       setRoleSession(role)
       setUserSession(user)
       setDocumentoDigital(dd)
       setUserID(id)
       loggedSuccess = true
       localStorage.setItem('login', 'true');
       localStorage.setItem('token', token);
       closingSession.current = false;
      
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

  const logout = useCallback(() => {
    if (closingSession.current) return;
    closingSession.current = true;
    localStorage.clear();
    setIsLoggedIn(false);
    setRoleSession(null);
    setUserSession(null);
    setUserID(null);
    setDocumentoDigital(null);
    setUserActive(null);
    setUA(false);
    window.location.replace('/login');
  }, []);

  const validarSesionActiva = useCallback(() => {
    const active = localStorage.getItem('login') === 'true';
    if (!active) return false;
    const expiresAt = tokenExpiresAt(localStorage.getItem('token'));
    if (!expiresAt || expiresAt <= Date.now()) {
      logout();
      return false;
    }
    return true;
  }, [logout]);

  useEffect(() => {
    let timer;
    const check = () => {
      clearTimeout(timer);
      if (!validarSesionActiva()) {
        if (isLoggedIn && localStorage.getItem('login') !== 'true') logout();
        return;
      }
      const remaining = tokenExpiresAt(localStorage.getItem('token')) - Date.now();
      timer = setTimeout(check, Math.min(Math.max(remaining, 1), 2147483647));
    };
    check();
    window.addEventListener('focus', check);
    window.addEventListener('storage', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [isLoggedIn, logout, validarSesionActiva]);

  useEffect(() => {
    const clients = [axios, apiClient];
    const registrations = clients.map(client => {
      const requestId = client.interceptors.request.use(config => {
        if (isCurrentApiRequest(config, APIURL, localStorage.getItem('token')) && !validarSesionActiva()) {
          throw new axios.CanceledError('La sesión ha expirado.');
        }
        return config;
      });
      const responseId = client.interceptors.response.use(response => response, error => {
        if (error.response?.status === 401 && isCurrentApiRequest(error.config, APIURL, localStorage.getItem('token'))) logout();
        return Promise.reject(error);
      });
      return { client, requestId, responseId };
    });
    return () => registrations.forEach(({ client, requestId, responseId }) => {
      client.interceptors.request.eject(requestId);
      client.interceptors.response.eject(responseId);
    });
  }, [APIURL, logout, validarSesionActiva]);

  const execShowAlert = (data) =>{
    setShowAlertContext(true)
    setDataAlertContext(data)
    mostrarAlerta(data)
  }

  const execHideAlert = (data) =>{
    setShowAlertContext(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn,userSession, roleSession,userID, userActive, login, logout, validarSesionActiva, ua, showAlertContext, execShowAlert, execHideAlert, documentoDigital }}>
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
