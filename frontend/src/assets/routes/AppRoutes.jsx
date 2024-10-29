// src/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//IMPORTACION DE LAS PAGES
import LandingPage from '../pages/LandingPage/LandingPage'; //landing
import Registro from '../pages/Registro/Registro';
import Login from '../pages/Login/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} />
    </Routes>
  );
};

export default AppRoutes;
