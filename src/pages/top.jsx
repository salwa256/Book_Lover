import React, { useState, useEffect } from "react";
import Navbar from "../component/navbar";
import "./style.css";

const LogPage = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/popular");
        if (!res.ok) throw new Error("Gagal mengambil data");

        const data = await res.json();

        const adaptedBooks = data.popular_books.map((item) => ({
          title: item.judul,
          pengarang: item.pengarang,
          category: item.klasifikasi,
          description: `Buku karya ${item.pengarang}`,
          image_url: item.image_url,
          count: item.count,
        }));

        setTopBooks(adaptedBooks);

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

      <div className="page">
        <main className="container">
          <div className="header-content">
            <div className="top-books-container">
              <h2>Buku Paling Banyak Dicari</h2>

              {loading && <p>Memuat data populer...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loading && !error && topBooks.length === 0 && (
                <p>Belum ada buku populer yang tercatat.</p>
              )}

              <ul className="book-list">
                {topBooks.map((book, index) => (
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
                      <h3>{book.title.toUpperCase()}</h3>
                      <p><b>Pengarang:</b> {book.pengarang}</p>
                      <p><b>Kategori:</b> {book.category}</p>
                      <p>{book.description?.substring(0, 100)}...</p>
                      <span className="badge">
                        Dicari {book.count}x
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogPage;