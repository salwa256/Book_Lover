import React, { useState } from "react";
import Navbar from "../component/navbar";
import "./style.css";

const SearchPage = () => {
  const [titleInput, setTitleInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!titleInput) {
      alert("Judul buku wajib diisi");
      return;
    }

    setLoading(true);

    const url = `http://127.0.0.1:8000/search?judul=${encodeURIComponent(
      titleInput
    )}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengambil data");

      const data = await res.json();

      // 🔁 Adaptasi data backend
      const adaptedResults = data.results.map((item) => ({
        title: item.judul,
        pengarang: item.pengarang,
        category: item.klasifikasi,
        image_url: item.image_url,
        description: `Buku karya ${item.pengarang}`,
      }));

      // 🚫 Filter duplikat
      const uniqueResults = [];
      const seenTitles = new Set();

      adaptedResults.forEach((book) => {
        const key = book.title.toLowerCase();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          uniqueResults.push(book);
        }
      });

      setResults(uniqueResults);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Navbar />

      <div className="page">
        <main className="container">
          {/* SEARCH SECTION */}
          <div className="search-section">
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

          {/* RESULT SECTION */}
          <div className="book-list">
            {loading ? (
              <p>Loading...</p>
            ) : results.length > 0 ? (
              results.map((book, index) => (
                <div key={index} className="book-card">
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
                    <h3>{book.title.toUpperCase()}</h3>
                    <p>
                      <b>Pengarang:</b> {book.pengarang}
                    </p>
                    <p>
                      <b>Kategori:</b> {book.category}
                    </p>
                    <p className="desc">
                      {book.description?.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada buku ditemukan.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;