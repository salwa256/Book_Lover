const btnCari = document.getElementById("btnCari");
const bookList = document.getElementById("book-list");

btnCari.addEventListener("click", async () => {
  const mood = document.getElementById("mood").value;
  const category = document.getElementById("category").value;

  if (!mood || !category) {
    alert("Mood dan kategori harus dipilih");
    return;
  }

  bookList.innerHTML = "Loading...";

  try {
    const response = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, category })
    });

    const data = await response.json();
    renderBooks(data);
  } catch (error) {
    bookList.innerHTML = "Gagal mengambil data";
    console.error(error);
  }
});

/* ===============================
   MAPPING JUDUL → GAMBAR
=============================== */
const bookImages = {
  "kamus sejarah lengkap": "/assets/sejarah.webp",
  "seimbangkan dunia dan akhirat": "/assets/dunia.jpg",

};

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getBookImage(title) {
  const key = normalizeTitle(title);
  return bookImages[key] || null; // null kalau tidak ada
}

/* ===============================
   RENDER BUKU
=============================== */
function renderBooks(books) {
  bookList.innerHTML = "";

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    const image = getBookImage(book.title);

    card.innerHTML = `
      ${
        image
          ? `<img src="${image}" alt="Cover ${book.title}" class="book-cover">`
          : `<div class="no-image">FOTO BELUM TERSEDIA</div>`
      }
      <h3>${book.title}</h3>
      <p><b>Kategori:</b> ${book.category}</p>
      <p><b>Mood:</b> ${book.mood}</p>
      <p>${book.description.substring(0, 100)}...</p>
    `;

    bookList.appendChild(card);
  });
}
