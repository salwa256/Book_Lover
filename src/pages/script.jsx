import React, { useState } from 'react';
import './style.css';
import Navbar from '../component/navbar'; 
import { useNavigate } from "react-router-dom";


function Rekomendasi() {
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!mood || !genre) {
      alert("Mood dan genre harus dipilih");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre: genre,
          subgenre: mood,
        }),
      });

      if (!response.ok) throw new Error("Gagal mengambil data");

      const data = await response.json();

      setBooks(data.recommendations);

    } catch (error) {
      console.error(error);
      alert("Server tidak merespon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />

      <div className="page">
        <main className="container">

          {/* FILTER */}
          <form
            className="filter"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={mood ? "selected" : ""}
            >
              <option value="">Apa yang kamu rasakan...</option>
              <option value="senang">Senang</option>
              <option value="penasaran">Penasaran</option>
              <option value="sedih">Sedih</option>
              <option value="tenang">Tenang</option>
              <option value="marah">Marah</option>
            </select>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={genre ? "selected" : ""}
            >
              <option value="">Pilih Genre</option>
              <option value="agama anak">Agama Anak</option>
              <option value="agama umum">Agama Umum</option>
              <option value="sains umum">Sains Umum</option>
              <option value="sastra anak">Sastra Anak</option>
              <option value="sastra umum">Sastra Umum</option>
              <option value="sastra romance">Sastra Romance</option>
              <option value="sejarah umum">Sejarah Umum</option>
              <option value="sosial politik anak">Sosial Politik Anak</option>
              <option value="sosial politik umum">Sosial Politik Umum</option>
              <option value="teknologi anak">Teknologi Anak</option>
              <option value="teknologi umum">Teknologi Umum</option>
              <option value="umum umum">Umum</option>
            </select>

            <button type="submit">Cari</button>
          </form>

          {/* HASIL */}
          <ul className="book-list">
            {loading ? (
              <div className="loading">Sedang mencari rekomendasi...</div>
            ) : books.length > 0 ? (
              books.map((book, index) => (
                <li key={index} className="book-card">
                  <div className="book-image">
                    <img
                      src={`http://127.0.0.1:8000${book.image_url}`}
                      alt={book.judul}
                      onError={(e) => {
                        e.target.src =
                          "http://127.0.0.1:8000/images/no_cover.png";
                      }}
                    />
                  </div>

                  <div className="book-info">
                    <h3>{book.judul}</h3>
                    <p><b>Pengarang:</b> {book.pengarang}</p>
                    <p><b>Kategori:</b> {book.klasifikasi}</p>
<p className="desc">
  Buku karya {book.pengarang}
</p>
                  </div>
                </li>
              ))
            ) : (
              <div className="empty-state">
                Silakan pilih mood dan genre untuk melihat rekomendasi.
              </div>
            )}
          </ul>

          {/* TOMBOL TAMBAH BUKU */}
          

        </main>
      </div>
    </div>
  );
}

export default Rekomendasi;