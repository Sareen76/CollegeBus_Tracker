import React, { useState } from 'react';
import './App.css';
import "./style.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import Stats from './pages/Stats';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardLayoutBasic from './layout/DashboardLayoutBasic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import LiveMap from './pages/LiveMap.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import { useAuth } from './context/context+reducer.jsx';

<<<<<<< HEAD
=======
import AddNewRoute from './pages/AddNewRoute.jsx';
import ShowDetails from './pages/ShowDetails.jsx';

>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
export default function App() {
  const{ state } = useAuth();

  return (
    <Routes>
      {!state.isAuthenticated ? (
        <>
          <Route path="/signin" element={<Login />} exact/>
        <Route path="/signup" component={<Signup/>} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </>
      ) : (
        <Route path="/" element={<DashboardLayoutBasic />}>
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stats" element={<Stats />} />
          <Route path="home" element={<Home />} />
          <Route path="livelocation" element={<LiveMap />} />
<<<<<<< HEAD
=======
          <Route path="addnewroute" element={<AddNewRoute/>} />
          <Route path="showDetails/:routeId" element={<ShowDetails/>} />
>>>>>>> 0dec10729552d52144b24b34afaf256d5669fbc1
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Route>
      )}
    </Routes>
  );
}


