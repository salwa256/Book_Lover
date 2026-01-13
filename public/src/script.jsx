import React, { useState } from 'react';
import './style.css';
import Navbar from './component/navbar'; 

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

function App() {
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizeTitle = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleSearch = async () => {
    if (!mood || !category) {
      alert("Mood dan kategori harus dipilih");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, category })
      });

      if (!response.ok) throw new Error("Gagal mengambil data dari server");

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Gagal mengambil data. Pastikan server backend Anda menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />

      <main className="container">
        <div className="header-content">
          <div className="logo">
            <h1>BO <br /> OK</h1>
            <h3>Lover</h3>
          </div>
        </div>

        {/* SECTION FILTER */}
        <form className="filter"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <select 
            value={mood} 
            className={mood ? "selected" : ""} 
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Apa yang kamu rasakan dan inginkan ...</option>
            <option value="senang">Senang</option>
            <option value="penasaran">Penasaran</option>
            <option value="sedih">Sedih</option>
            <option value="tenang">Tenang</option>
            <option value="marah">Marah</option>
          </select>

          <select 
            value={category} 
            className={category ? "selected" : ""} 
            onChange={(e) => setCategory(e.target.value)}
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

          <button onClick={handleSearch}>Cari</button>
        </form>

        {/* HASIL / LIST BUKU - STRUKTUR DISAMAKAN DENGAN LOGPAGE */}
        <ul id="book-list" className="book-list">
          {loading ? (
            <div className="loading">Sedang mencari buku terbaik untukmu...</div>
          ) : books.length > 0 ? (
            books.map((book, index) => {
              const imgKey = normalizeTitle(book.title);
              const imageSrc = BOOK_IMAGES[imgKey];

              return (
                <li key={index} className="book-card">
                  <div className="book-image">
                    {imageSrc ? (
                      <img 
                        src={imageSrc} 
                        alt={`Cover ${book.title}`} 
                        className="book-cover" 
                      />
                    ) : (
                      <div className="no-image">FOTO BELUM TERSEDIA</div>
                    )}
                  </div>
                  
                  <div className="book-info">
                    <h3>{book.title.toUpperCase()}</h3>
                    <p><b>Mood:</b> {book.mood}</p>
                    <p><b>Kategori:</b> {book.category}</p>
                    <p className="description">
                      {book.description 
                        ? `${book.description.substring(0, 100)}...` 
                        : "Tidak ada deskripsi."}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="empty-state">Silakan pilih mood dan kategori untuk melihat rekomendasi.</div>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;