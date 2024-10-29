import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! La pagina que estas buscando no existe.</p>
      <div className="notfound-animation">
        <FontAwesomeIcon icon={faCog} className="notfound-gear" />
        <div className="notfound-shadow"></div>
      </div>
      <button className="notfound-button" onClick={() => window.location.href = '/'}>
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
