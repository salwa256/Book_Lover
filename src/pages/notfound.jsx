import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "80px" }}>404</h1>
      <p>Halaman yang kamu cari tidak ditemukan</p>

      <Link to="/" style={{ marginTop: "20px" }}>
        ⬅ Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
