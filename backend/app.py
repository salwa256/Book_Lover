from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import os
from sklearn.metrics.pairwise import cosine_similarity

# ===============================
# INIT APP
# ===============================
app = FastAPI(title="Book Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# HELPER & CLEANING
# ===============================
def normalize_title(title: str) -> str:
    return str(title).lower().strip().replace("  ", " ")

# ===============================
# LOAD DATA (FIXED)
# ===============================
# Memastikan data bersih dari awal agar tidak ada duplikat di tampilan
df = pd.read_csv("dataset_buku.csv", sep=",", engine="python", on_bad_lines="skip")
df.columns = df.columns.str.strip().str.lower()
df = df.rename(columns={
    "judul": "title",
    "klasifikasi": "category",
    "genre": "mood",
    "content": "description"
})

df["title"] = df["title"].apply(normalize_title)
df["description"] = df["description"].fillna("")
df["category"] = df["category"].fillna("")
df["mood"] = df["mood"].fillna("")

# KUNCI: Hapus duplikat judul agar tidak muncul double
df = df.drop_duplicates(subset=["title"]).reset_index(drop=True)

# ===============================
# LOAD MODEL
# ===============================
tfidf = joblib.load("tfidf_vectorizer.pkl")
df["features"] = df["description"] + " " + df["category"] + " " + df["mood"]
tfidf_matrix = tfidf.transform(df["features"])

# ===============================
# BOOK LOG LOGIC (FIXED)
# ===============================
BOOK_LOG = "book_log.json"

def save_book_log(book):
    """Menyimpan statistik buku yang dilihat/dicari."""
    data = {}
    
    # Buat file jika belum ada, atau baca jika sudah ada
    if os.path.exists(BOOK_LOG):
        try:
            with open(BOOK_LOG, "r") as f:
                content = f.read().strip()
                if content:
                    data = json.loads(content)
        except:
            data = {}

    title = book["title"]
    if title not in data:
        data[title] = {
            "count": 1,
            "category": book["category"],
            "mood": book["mood"],
            "description": book["description"]
        }
    else:
        data[title]["count"] += 1

    with open(BOOK_LOG, "w") as f:
        json.dump(data, f, indent=2)

# ===============================
# REQUEST MODEL
# ===============================
class RecommendRequest(BaseModel):
    mood: str
    category: str

# ===============================
# ROUTES
# ===============================

@app.post("/recommend")
def recommend(data: RecommendRequest):
    if not data.mood.strip() or not data.category.strip():
        raise HTTPException(status_code=400, detail="Mood dan category wajib diisi")

    query = f"{data.mood} {data.category}"
    query_vec = tfidf.transform([query])
    similarity_scores = cosine_similarity(query_vec, tfidf_matrix)[0]

    # Ambil 5 teratas
    top_indices = similarity_scores.argsort()[-5:][::-1]
    result = df.iloc[top_indices][["title", "category", "mood", "description"]].to_dict(orient="records")

    for book in result:
        save_book_log(book)

    return result

@app.get("/search")
def search_book(title: str, limit: int | None = None):
    if not title.strip():
        raise HTTPException(status_code=400, detail="Judul wajib diisi")

    # Filter berdasarkan judul yang mengandung kata kunci
    filtered_df = df[df["title"].str.contains(title.lower(), na=False)]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="Buku tidak ditemukan")

    if limit:
        filtered_df = filtered_df.head(limit)

    result = filtered_df[["title", "category", "mood", "description"]].to_dict(orient="records")
    
    # Catat ke log agar muncul di Top Books
    for book in result:
        save_book_log(book)

    return result

@app.get("/top-books")
def top_books(limit: int = 10):
    # Log ke terminal untuk pengecekan lokasi file
    print(f"Mencoba membaca file log di: {BOOK_LOG}")

    if not os.path.exists(BOOK_LOG):
        print("File tidak ditemukan!")
        return []

    try:
        with open(BOOK_LOG, "r") as f:
            content = f.read().strip()
            if not content:
                print("File ada tapi kosong!")
                return []
            data = json.loads(content)
            
        # Urutkan berdasarkan count terbanyak
        sorted_books = sorted(
            data.items(), 
            key=lambda x: x[1].get("count", 0), 
            reverse=True
        )[:limit]

        result = []
        for title, info in sorted_books:
            result.append({
                "title": title,
                "category": info.get("category", ""),
                "mood": info.get("mood", ""),
                "description": info.get("description", ""),
                "count": info.get("count", 0)
            })
        
        print(f"Berhasil mengirim {len(result)} data.")
        return result
    except Exception as e:
        print(f"Terjadi error: {e}")
        return []