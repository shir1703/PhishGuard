from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
classifier = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-sms-spam-detection")

@app.route("/analyze", methods=["POST"])
def analyze():
    print("📥 בקשת POST התקבלה!")
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = classifier(text)[0]
    return jsonify({
        "label": result["label"],
        "score": result["score"]
    })

if __name__ == "__main__":
    print("🚀 Flask server starting...")
    app.run(port=5000)
