document.getElementById("scan-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const text = document.getElementById("phishText").value;
  const resultDiv = document.getElementById("result");

  try {
    const response = await fetch("http://localhost:3000/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data = await response.json();

      resultDiv.innerHTML = `
        <div style="padding: 20px; font-size: 18px;">
          <p><strong>🧠 AI Verdict:</strong> ${data.label}</p>
          <p><strong>🧪 Confidence:</strong> ${(data.score * 100).toFixed(2)}%</p>
        </div>
      `;
    } else {
      resultDiv.innerHTML = "<p style='color: orange;'>⚠️ Sent, but error in response.</p>";
    }
  } catch (err) {
    console.error("❌ Fetch error:", err);
    resultDiv.innerHTML = "<p style='color: red;'>❌ Could not connect to server.</p>";
  }
});
