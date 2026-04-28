from fastapi import FastAPI, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
import shutil
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import uuid

# =====================
# BASE DIRECTORY
# =====================
BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset_buku.csv"
IMAGES_DIR = BASE_DIR / "static/images"

IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# =====================
# INIT APP
# =====================
app = FastAPI(title="Sistem Rekomendasi Buku")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# =====================
# LOAD DATASET
# =====================
if DATASET_PATH.exists():
    df = pd.read_csv(DATASET_PATH)
else:
    df = pd.DataFrame(columns=[
        "judul",
        "pengarang",
        "klasifikasi",
        "status",
        "genre_utama",
        "subgenre",
        "genre",
        "content",
        "image_url"
    ])

df = df.fillna("")
def normalize_filename(text):
    return text.lower().strip().replace(" ", "_")

def find_existing_image(judul):
    base_name = normalize_filename(judul)

    for ext in ["jpg", "jpeg", "png", "webp"]:
        file_path = IMAGES_DIR / f"{base_name}.{ext}"
        if file_path.exists():
            return f"/images/{base_name}.{ext}"

    return "/images/no_cover.png"

df["image_url"] = df["judul"].apply(find_existing_image)

# =====================
# TF-IDF SETUP
# =====================
vectorizer = TfidfVectorizer(stop_words=None)
tfidf_matrix = None

def update_tfidf():
    global tfidf_matrix
    if len(df) == 0:
        tfidf_matrix = None
        return
    
    tfidf_matrix = vectorizer.fit_transform(df["content"])

update_tfidf()

search_log = Counter()

# =====================
# ROOT
# =====================
@app.get("/", response_class=HTMLResponse)
def home():
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        return index_file.read_text(encoding="utf-8")
    return "<h2>Backend Sistem Rekomendasi Buku Aktif</h2>"

# =====================
# TAMBAH / UPDATE BUKU
# =====================
@app.post("/buku")
async def tambah_buku(
    judul: str = Form(...),
    penulis: str = Form(...),
    mood: str = Form(...),
    genre: str = Form(...),
    kategori: str = Form(...),
    file: UploadFile = File(...)
):
    global df

    # simpan gambar
    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"
    file_location = IMAGES_DIR / unique_name

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/images/{unique_name}"

    # content (buat rekomendasi)
    content = f"{judul} {penulis} {genre} {mood}"

    # data baru
    new_row = {
        "judul": judul,
        "pengarang": penulis,        # mapping
        "klasifikasi": kategori,     # mapping
        "genre": genre,
        "content": content,
        "image_url": image_url
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    df.to_csv(DATASET_PATH, index=False)
    update_tfidf()

    return {"message": "Buku berhasil ditambahkan"}
# =====================
# RECOMMENDATION
# =====================
class RequestRekomendasi(BaseModel):
    genre: str
    subgenre: str

@app.post("/recommend")
def recommend(data: RequestRekomendasi):

    if tfidf_matrix is None:
        return {"recommendations": [], "popular": []}

    query_text = f"{data.genre} {data.subgenre}".strip()
    query_vec = vectorizer.transform([query_text])

    similarity = cosine_similarity(query_vec, tfidf_matrix)[0]
    top_idx = similarity.argsort()[-5:][::-1]

    hasil = []

    for i in top_idx:
        row = df.iloc[i]

        hasil.append({
            "judul": row["judul"],
            "pengarang": row["pengarang"],
            "klasifikasi": row["klasifikasi"],
            "image_url": row["image_url"],
            "description": f"Buku karya {row['pengarang']}"
        })

        search_log[row["judul"]] += 1

    return {
        "recommendations": hasil,
        "popular": [j for j, _ in search_log.most_common(5)]
    }

# =====================
# SEARCH
# =====================
@app.get("/search")
def search_buku(judul: str = Query(..., min_length=1)):

    hasil = df[df["judul"].str.contains(judul, case=False, na=False)]

    books = []
    seen_titles = set()

    for _, row in hasil.iterrows():

        if row["image_url"].strip() == "":
            continue

        key = row["judul"].lower()
        if key in seen_titles:
            continue

        seen_titles.add(key)

        books.append({
            "judul": row["judul"],
            "pengarang": row["pengarang"],
            "klasifikasi": row["klasifikasi"],
            "image_url": row["image_url"]
        })

    return {
        "keyword": judul,
        "results": books
    }

# =====================
# POPULAR BOOKS
# =====================
@app.get("/popular")
def popular_books(limit: int = 5):

    hasil = []

    for judul, count in search_log.most_common(limit):
        row = df[df["judul"] == judul].iloc[0]

        hasil.append({
            "judul": judul,
            "pengarang": row["pengarang"],
            "klasifikasi": row["klasifikasi"],
            "image_url": row["image_url"],
            "count": count
        })

    return {
        "total": len(hasil),
        "popular_books": hasil
    }