# PhishGuard 🛡️

PhishGuard is a fullstack phishing detection system built with a client-server architecture and microservices.

## 🧠 How it works

1. The **frontend** (HTML/CSS/JS) sends user-submitted messages to a Node.js **server** via `/api/scan`.
2. The Node.js **server**:
   - Validates the input.
   - Sends the text to a **Python Flask microservice** hosting a fine-tuned BERT model (`phishing_analyzer.py`).
   - Waits for the prediction (`LABEL_1` or `LABEL_0`, with a score).
   - Based on this, it maps to a **user-friendly label**:
     - `🚨 Phishing Detected`
     - `⚠️ Suspicious`
     - `✅ Safe`
   - Sends that result back to the frontend for display.
3. The **Flask microservice** loads and uses a lightweight NLP model (`mrm8488/bert-tiny-finetuned-sms-spam-detection`) from HuggingFace for classification.

## 📦 Project structure

```
phishguard/
├── client/                 # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server/                 # Node.js backend
│   └── server.js
│
├── services/               # Microservices
│   └── phishing_analyzer.py
│
└── README.md               # Project overview
```

## 🧪 Testing & Tools

- **Postman** used for backend API testing
- **MongoDB** optionally integrated for persistence (not used for caching in this version)
- **node-fetch** used to call the Python microservice
- **Flask + Transformers** for ML model serving

## ⚙️ Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **ML Microservice**: Python, Flask, Transformers (BERT)
- **Database (optional)**: MongoDB
- **Tools**: Postman, VS Code

## 🚀 How to run

1. **Start the BERT microservice**:
   ```bash
   cd services/
   python phishing_analyzer.py
   ```

2. **Start the Node.js server**:
   ```bash
   cd server/
   node server.js
   ```

3. **Open `client/index.html`** in the browser, or use **Postman** to test the backend.

## 🧠 Notes

- Model score thresholds were chosen based on experimentation
- Input text is sent from frontend → Node → Python (BERT) → Node → frontend.
- This system is designed to simulate real-time phishing detection, not for production usage.

