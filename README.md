# PhishGuard 🛡️

PhishGuard is a real-time phishing detection web app built with microservices architecture, combining **AI**, **cybersecurity**, and **fullstack development**.  
It uses a fine-tuned **BERT phishing model** to classify messages as **phishing**, **suspicious**, or **benign**.

## 🧠 How It Works

1. **Frontend** (HTML/CSS/JS) – served via Node.js Express – lets users submit a message for analysis.
2. **Backend (Node.js + Express)**:
   - Receives the text via `/api/scan`.
   - Sends it to a Flask microservice for NLP classification.
   - Converts model output (`phishing` or `benign`) into a user-friendly label:
     - 🚨 **Phishing detected** – if label is `phishing` with high confidence
     - ⚠️ **Suspicious** – if label is `phishing` with lower confidence
     - ✅ **Safe** – if label is `benign`
   - Stores the result in MongoDB.
3. **Flask microservice**:
   - Loads the fine-tuned **BERT model**: `ealvaradob/bert-finetuned-phishing`
   - Returns predicted label and confidence score.
4. Everything runs in **Docker containers**, orchestrated by **Docker Compose**.

## 📦 Project Structure

```
phishguard/
├── server/
│   ├── client/              # Frontend files (index.html, style.css, script.js)
│   ├── server.js            # Node.js backend
│   ├── package.json
│   └── Dockerfile-node
│
├── services/                # Flask microservice
│   ├── phishing_analyzer.py
│   ├── requirements.txt
│   └── Dockerfile-flask
│
├── docker-compose.yml       # Docker Compose setup
└── README.md
```

## ⚙️ Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **NLP Microservice**: Python, Flask, Hugging Face Transformers
- **Database**: MongoDB (with Mongoose)
- **DevOps**: Docker, Docker Compose

## 🚀 How to Run Locally

> ✅ You only need Docker installed.

```bash
docker-compose up --build
```

Then go to 👉 [http://localhost:3000](http://localhost:3000)

Or test the API directly:

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"text":"Click here to verify your account."}'
```

## 🧠 Classification Logic

| Model Output | Score      | UI Label              |
|--------------|------------|------------------------|
| `benign`     | —          | ✅ Safe               |
| `phishing`   | > 0.8      | 🚨 Phishing detected  |
| `phishing`   | ≤ 0.8      | ⚠️ Suspicious         |

## 🗃️ MongoDB Scan Schema

```json
{
  "text": "...",
  "label": "⚠️ Suspicious",
  "score": 0.74,
  "model": "phishing",
  "timestamp": "2025-06-17T..."
}
```