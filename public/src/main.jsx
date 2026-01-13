import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './script';           // Halaman Rekomendasi (Filter Suasana Hati)
import LogPage from './app';   // Halaman Log (Buku Populer)
import SearchPage from './search';  // Halaman Search
import './style.css';                // Pastikan file CSS ada di folder src

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/log" element={<LogPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);