export async function generateText(prompt: string) {
  const apiKey = process.env.NARAYA_API_KEY;
  const baseUrl = process.env.NARAYA_BASE_URL;

  if (!apiKey) throw new Error("Missing NARAYA_API_KEY");

  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-M3",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Naraya API Error:", err);
    throw new Error("Naraya text API failed");
  }

  const data = await res.json();

  // OpenAI-style response handling
  return (
    data?.choices?.[0]?.message?.content ||
    data?.result ||
    data
  );
}
