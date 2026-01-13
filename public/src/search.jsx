import React, { useState } from 'react';
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

const SearchPage = () => {
  const [titleInput, setTitleInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeTitle = (title) => {
    if (!title) return "";
    return title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  };

  const handleSearch = async () => {
    if (!titleInput) {
      alert("Judul buku wajib diisi");
      return;
    }

    setLoading(true);
    const url = `http://127.0.0.1:8000/search?title=${encodeURIComponent(titleInput)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil rekomendasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />
      
      <main className="container">
        <div className="search-section">
          <h2>Cari Buku</h2>
          <div className="search-box"> 
            <input 
              type="text" 
              placeholder="Masukkan judul buku..." 
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          <button onClick={handleSearch}>Cari</button>
          </div>
        </div>

        <div id="result" className="book-list">
          {loading ? (
            <p>Loading...</p>
          ) : results.length > 0 ? (
            results.map((book, index) => {
              const imagePath = BOOK_IMAGES[normalizeTitle(book.title)];
              return (
                <div key={index} className="book-card">
                  <div className="book-image">
                    {imagePath ? (
                      <img src={imagePath} alt={book.title} className="book-cover" />
                    ) : (
                      <div className="no-image">FOTO BELUM TERSEDIA</div>
                    )}
                  </div>
                  <div className="book-info">
                    <h3>{book.title.toUpperCase()}</h3>
                    <p><b>Kategori:</b> {book.category}</p>
                    <p><b>Mood:</b> {book.mood}</p>
                    <p className="desc">{book.description?.substring(0, 100)}...</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Tidak ada rekomendasi ditemukan.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;