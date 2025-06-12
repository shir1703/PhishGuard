
# PhishGuard 🛡️

PhishGuard is a phishing detection project structured as microservices, built with Node.js and Flask.

## 🧠 How It Works

1. **Frontend** (HTML/CSS/JS) sends text to the Node.js server at `/api/scan`.
2. **Backend (Node.js)**:
   - Validates the input.
   - Sends the text to the Flask microservice (BERT) at `http://flask:5000/analyze`.
   - Receives the result (`LABEL_1` or `LABEL_0` with a score).
   - Converts it to a user-friendly label:
     - 🚨 Phishing detected
     - ⚠️ Suspicious
     - ✅ Safe
   - Returns the result to the frontend.
   - Saves the scans in MongoDB.
3. **Flask microservice** loads a small NLP model (bert-tiny) and returns the prediction.

## 📦 Project Structure

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
├── services/               # Flask microservice
│   ├── phishing_analyzer.py
│   ├── requirements.txt
│   └── Dockerfile-flask
│
├── docker-compose.yml      # Docker Compose setup
└── README.md               # This documentation
```

## ⚙️ Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Microservice**: Python (Flask), Transformers (BERT)
- **Database**: MongoDB
- **Tools**: Docker Compose, Postman

## 🚀 How to Run (Docker)

1. Make sure Docker is installed and running on your machine.
2. In the project root directory, run:
   ```bash
   docker-compose up --build
   ```
   This will start 3 containers:
   - `mongo` (MongoDB)
   - `flask` (Flask microservice)
   - `node` (Node.js backend)

3. After everything is up:
   - Go to: [http://localhost:3000](http://localhost:3000) in your browser.
   - Or open `client/index.html` directly to check the interface.
   - You can also test the API with Postman or using `curl`:
     ```bash
     curl -X POST http://localhost:3000/api/scan -H "Content-Type: application/json" -d '{"text":"hi"}'
     ```

## 🧠 Notes

- The code is tested and works within the Docker environment. The services communicate via container names (`flask`, `mongo`).
- The frontend (`index.html`) is served through the Node.js server (`express.static`) by default.
- You can also open `index.html` directly in the browser, but in this case, ensure the API is accessible at `http://localhost:3000/api/scan`.

