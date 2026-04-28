import React, { useState } from "react";
import Navbar from "../component/navbar";
import "./style.css";

const TambahBuku = () => {
  const [buku, setBuku] = useState({
    judul: "",
    penulis: "",
    mood: "",
    genre: "",
    kodeRak: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setBuku({
        ...buku,
        file: files[0],
      });
    } else {
      setBuku({
        ...buku,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", buku.judul);
    formData.append("penulis", buku.penulis);
    formData.append("mood", buku.mood);
    formData.append("genre", buku.genre);
    formData.append("kategori", buku.kodeRak);
    formData.append("file", buku.file);

    try {
      const response = await fetch("http://127.0.0.1:8000/buku", {
        method: "POST",
        body: formData, // ⚠ tidak pakai JSON lagi
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan buku");
      }

      alert("Buku dan sampul berhasil ditambahkan!");

      // Reset form
      setBuku({
        judul: "",
        penulis: "",
        mood: "",
        genre: "",
        kodeRak: "",
        file: null,
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan buku");
    }
  };

  return (
    <div className="App">
      <Navbar />

      <button
        onClick={() => {
          localStorage.removeItem("isLogin");
          window.location.href = "/";
        }}
      >
        Logout
      </button>

      <div className="tambah-buku-container">
        <h2>Tambah Buku Baru</h2>

        <form className="tambah-buku-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="judul"
            placeholder="Judul Buku"
            value={buku.judul}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="penulis"
            placeholder="Penulis"
            value={buku.penulis}
            onChange={handleChange}
            required
          />

          <select
            name="mood"
            value={buku.mood}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Mood</option>
            <option value="senang">Senang</option>
            <option value="penasaran">Penasaran</option>
            <option value="sedih">Sedih</option>
            <option value="tenang">Tenang</option>
            <option value="marah">Marah</option>
          </select>

          <select
            name="genre"
            value={buku.genre}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Genre</option>
            <option value="romance">Romance</option>
            <option value="motivasi">Motivasi</option>
            <option value="sastra">Sastra</option>
            <option value="puisi">Puisi</option>
            <option value="self-help">Self-help</option>
            <option value="agama">Agama</option>
            <option value="filsafat">Filsafat</option>
            <option value="sejarah">Sejarah</option>
            <option value="biografi">Biografi</option>
          </select>

          <input
            type="number"
            step="0.001"
            name="kodeRak"
            placeholder="Kode Rak (contoh: 372.242)"
            value={buku.kodeRak}
            onChange={handleChange}
            required
          />

          {/* INPUT UPLOAD GAMBAR */}
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <button type="submit">Simpan Buku</button>
        </form>
      </div>
    </div>
  );
};

export default TambahBuku;