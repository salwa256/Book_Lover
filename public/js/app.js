/* ===============================
   1. MAPPING JUDUL → GAMBAR LOKAL
=============================== */
const bookImages = {
  "kamus sejarah lengkap": "/assets/sejarah.webp",
  "Seimbangkan dunia dan akhirat": "/assets/dunia.jpg",
  "panduan senam stroke": "/assets/panduan_senam.jpg",
};

/* ===============================
   2. FUNGSI HELPER (Diletakkan di luar)
=============================== */
function normalizeTitle(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Hapus simbol
    .replace(/\s+/g, " ")    // Hapus spasi ganda
    .trim();
}

function getBookImage(title) {
  const key = normalizeTitle(title);
  return bookImages[key] || null;
}

/* ===============================
   3. LOAD DATA KE HALAMAN
=============================== */
document.addEventListener("DOMContentLoaded", async () => {
  const listElement = document.getElementById("top-books-list");
  
  // Jika elemen tidak ada di HTML halaman ini, hentikan script
  if (!listElement) {
    console.error("Elemen 'top-books-list' tidak ditemukan di HTML.");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/top-books");
    const data = await res.json();

    // Reset konten loading
    listElement.innerHTML = "";

    if (!data || data.length === 0) {
      listElement.innerHTML = "<p>Belum ada buku populer yang tercatat.</p>";
      return;
    }

    // Render kartu buku
    data.forEach(book => {
      const li = document.createElement("li");
      li.className = "book-card";
      
      const image = getBookImage(book.title);

      li.innerHTML = `
        <div class="book-image">
          ${image 
            ? `<img src="${image}" alt="${book.title}" class="book-cover">` 
            : `<div class="no-image">FOTO BELUM TERSEDIA</div>`
          }
        </div>
        <div class="book-info">
          <h3>${book.title.toUpperCase()}</h3>
          <p><b>Mood:</b> ${book.mood}</p>
          <p><b>Kategori:</b> ${book.category}</p>
          <p>${book.description.substring(0, 100)}...</p>
          <span class="badge">Dicari ${book.count}x</span>
        </div>
      `;
      listElement.appendChild(li);
    });
  } catch (error) {
    console.error("Gagal memuat data:", error);
    listElement.innerHTML = "<p>Gagal mengambil data dari server.</p>";
  }
});