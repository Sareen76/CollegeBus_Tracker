import React, { useState } from 'react'
import './App.css'
import { Routes, Route, Router, Navigate } from 'react-router-dom'
import Stats from './pages/Stats';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardLayoutBasic from './layout/DashboardLayoutBasic.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import LiveMap from './pages/LiveMap.jsx';

export default function App() {
  return (
    <Routes>
      {/* Parent Route */}
      <Route path="/" element={<DashboardLayoutBasic />}>
        {/* Child Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="stats" element={<Stats />} />
        <Route path="home" element={<Home />} />
        <Route path="livelocation" element={<LiveMap />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

