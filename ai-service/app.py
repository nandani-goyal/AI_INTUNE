# app.py

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)
@app.route("/")
def home():
    return "AI Service Running"

@app.route("/embed", methods=["POST"])
def embed():

    text = request.json["text"]

    embedding = model.encode(text)

    return jsonify({
        "embedding": embedding.tolist()
    })

if __name__ == "__main__":
    app.run(port=8000)