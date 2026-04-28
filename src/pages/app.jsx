import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Script from "./script";
import Search from "./search";
import Top from "./top";
import TambahBuku from "./tambahbuku"; // ✅ Tambah ini
import NotFound from "./notfound";
import ServerError from "./servererror";
import Login from "./login";
import ProtectedRoute from "../component/ProtectedRoute";

const Offline = () => (
  <div style={{ textAlign: "center", marginTop: "100px" }}>
    <h1>Tidak Ada Koneksi Internet</h1>
    <p>Periksa jaringan dan coba lagi.</p>
  </div>
);

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <Offline />;
  }

  return (
      <Routes>
  <Route path="/" element={<Script />} />
  <Route path="/search" element={<Search />} />
  <Route path="/log" element={<Top />} />

  <Route path="/login" element={<Login />} />

  <Route 
    path="/tambahbuku" 
    element={
      <ProtectedRoute>
        <TambahBuku />
      </ProtectedRoute>
    } 
  />

  <Route path="/500" element={<ServerError />} />
  <Route path="*" element={<NotFound />} />
</Routes>

  );
}

export default App;
