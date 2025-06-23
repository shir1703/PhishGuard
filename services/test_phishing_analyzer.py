import json
from phishing_analyzer import app

client = app.test_client()

def test_valid_phishing_text():
    response = client.post("/analyze", data=json.dumps({"text": "Verify your account now or it will be suspended!"}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 200
    assert data["label"].lower() == "phishing"

def test_valid_benign_text():
    response = client.post("/analyze", data=json.dumps({"text": "Hey, want to grab coffee tomorrow?"}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 200
    assert data["label"].lower() == "benign"

def test_missing_text_field():
    response = client.post("/analyze", data=json.dumps({}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 400
    assert "error" in data

def test_non_json_payload():
    response = client.post("/analyze", data="just a string", content_type="text/plain")
    assert response.status_code == 415  # כי Flask כבר מחזיר Unsupported Media Type לבד

def test_empty_text():
    response = client.post("/analyze", data=json.dumps({"text": ""}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 400
    assert "error" in data

def test_large_text():
    large_text = "This is a safe message. " * 1000
    response = client.post("/analyze", data=json.dumps({"text": large_text}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 400
    assert "error" in data

def test_special_characters():
    response = client.post("/analyze", data=json.dumps({"text": "<script>alert('XSS');</script>"}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 200
    assert "label" in data

def test_non_english_text():
    response = client.post("/analyze", data=json.dumps({"text": "שלום, איך אתה מרגיש היום?"}), content_type="application/json")
    data = response.get_json()
    assert response.status_code == 200
    assert "label" in data
