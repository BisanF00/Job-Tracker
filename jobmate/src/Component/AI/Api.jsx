export async function chat(messages) {
  const res = await fetch("http://localhost:5001/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
    }),
  });

  if (!res.ok) {
    return "Error: AI service unavailable.";
  }

  const data = await res.json();
  return data.reply || "No response from AI.";
}
