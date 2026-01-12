/* ===============================
   1. MAPPING JUDUL → GAMBAR LOKAL
=============================== */
const bookImages = {
 "kamus sejarah lengkap": "/assets/sejarah.webp",
  "seimbangkan dunia dan akhirat": "/assets/dunia.jpg",
  "panduan senam stroke": "/assets/panduan_senam.jpg",
  "biografi ummul mukminin aisyah": "/assets/aisyah.jpg",
  "110 tokoh dengan ide gila yang mendunia": "/assets/tokoh_gila.jpg",
  "accidentally engaged" : "/assets/Accidentally_Engaged.jpg",
};

/* ===============================
   2. FUNGSI HELPER
=============================== */
function normalizeTitle(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Menghapus simbol/tanda baca
    .replace(/\s+/g, " ")    // Menghapus spasi ganda
    .trim();
}

function getBookImage(title) {
  const key = normalizeTitle(title);
  return bookImages[key] || null; // Mengembalikan null jika tidak ada di mapping
}

/* ===============================
   3. LOGIKA PENCARIAN & RENDER
=============================== */
async function getRekomendasi() {
  const titleInput = document.getElementById("title").value;
  const resultContainer = document.getElementById("result");

  if (!titleInput) {
    alert("Judul buku wajib diisi");
    return;
  }

  resultContainer.innerHTML = "Loading...";

  const url = `http://127.0.0.1:8000/search?title=${encodeURIComponent(titleInput)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil data");
    
    const data = await res.json();
    renderBooks(data);
  } catch (err) {
    resultContainer.innerHTML = "Gagal mengambil rekomendasi";
    console.error(err);
  }
}

function renderBooks(books) {
  const resultContainer = document.getElementById("result");

  if (!books || !books.length) {
    resultContainer.innerHTML = "<p>Tidak ada rekomendasi ditemukan.</p>";
    return;
  }

  resultContainer.innerHTML = books.map(book => {
    // Ambil gambar berdasarkan mapping judul
    const imagePath = getBookImage(book.title);

    return `
      <div class="book-card">
        <div class="book-image">
          ${
            imagePath 
            ? `<img src="${imagePath}" alt="${book.title}" class="book-cover">` 
            : `<div class="no-image">FOTO BELUM TERSEDIA</div>`
          }
        </div>
        <div class="book-info">
          <h3>${book.title.toUpperCase()}</h3>
          <p><b>Kategori:</b> ${book.category}</p>
          <p><b>Mood:</b> ${book.mood}</p>
          <p class="desc">${book.description.substring(0, 100)}...</p>
        </div>
      </div>
    `;
  }).join("");
}