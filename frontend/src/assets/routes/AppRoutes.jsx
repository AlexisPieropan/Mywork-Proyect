//ARCHIVOS DE RUTAS PRINCIPALES DE LA APP

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//IMPORTACION DE LAS PAGES
import LandingPage from '../pages/LandingPage/LandingPage'; //landing
import Registro from '../pages/Registro/Registro';
import Login from '../pages/Login/Login';
import  NotFound  from '../pages/NotFound/NotFound';

/*
PAGINAS FALTANTES
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/service/:id" element={<ServiceDetailPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
*/

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
