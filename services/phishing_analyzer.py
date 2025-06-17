from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

print("🚀 טוען את המודל...")
classifier = pipeline("text-classification", model="ealvaradob/bert-finetuned-phishing")
print("✅ המודל נטען בהצלחה!")

@app.route("/analyze", methods=["POST"])
def analyze():
    print("📥 בקשת POST התקבלה!")  
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = classifier(text)[0]
    print(f"🔍 ניתוח הטקסט: {result}")
    return jsonify({
        "label": result["label"],
        "score": result["score"]
    })

if __name__ == "__main__":
    print("🚀 Flask server starting...") 
    app.run(host="0.0.0.0", port=5000)
