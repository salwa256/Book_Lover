import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar';
import './style.css';

/* ===============================
   MAPPING JUDUL → GAMBAR
=============================== */
const BOOK_IMAGES = {
  "kamus sejarah lengkap": "/assets/sejarah.webp",
  "seimbangkan dunia dan akhirat": "/assets/dunia.jpg",
  "panduan senam stroke": "/assets/panduan_senam.jpg",
  "biografi ummul mukminin aisyah": "/assets/aisyah.jpg",
  "110 tokoh dengan ide gila yang mendunia": "/assets/tokoh_gila.jpg",
  "accidentally engaged": "/assets/Accidentally_Engaged.jpg",
};

const LogPage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi Helper Normalisasi
  const normalizeTitle = (title) => {
    if (!title) return "";
    return title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  };

  // Fetch data saat komponen pertama kali dimuat (replacement DOMContentLoaded)
  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/top-books");
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        
        const data = await res.json();
        setTopBooks(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Gagal memuat data buku populer.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  return (
    <div className="App">
      <Navbar />

      <main className="container">
        <div className="header-content">
          <div className="top-books-container">
            <h2>Buku Paling Banyak Dicari</h2>
            
            {loading && <p>Memuat data populer...</p>}
            
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && topBooks.length === 0 && (
              <p>Belum ada buku populer yang tercatat.</p>
            )}

            <ul id="top-books-list" className="book-list">
              {topBooks.map((book, index) => {
                const imgKey = normalizeTitle(book.title);
                const image = BOOK_IMAGES[imgKey];

                return (
                  <li key={index} className="book-card">
                    <div className="book-image">
                      {image ? (
                        <img src={image} alt={book.title} className="book-cover" />
                      ) : (
                        <div className="no-image">FOTO BELUM TERSEDIA</div>
                      )}
                    </div>
                    <div className="book-info">
                      <h3>{book.title.toUpperCase()}</h3>
                      <p><b>Mood:</b> {book.mood}</p>
                      <p><b>Kategori:</b> {book.category}</p>
                      <p>{book.description?.substring(0, 100)}...</p>
                      <span className="badge">Dicari {book.count}x</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogPage;