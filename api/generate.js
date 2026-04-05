export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const prompt = body?.prompt;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ result: "No prompt provided" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 DEBUG (IMPORTANT)
    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ SAFE EXTRACTION
    let result = "No response";

    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content?.parts;
      if (parts && parts.length > 0) {
        result = parts.map(p => p.text).join(" ");
      }
    }

    res.status(200).json({ result });

  } catch (error) {
    res.status(500).json({ result: "Error: " + error.message });
  }
}
