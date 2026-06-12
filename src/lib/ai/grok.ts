export async function generateImage(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "x-ai/grok-imagine-image-quality",
        messages: [{ role: "user", content: prompt }]
      }),
    }
  );

  console.log("Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Status:", response.status);
    console.error("Response:", errorText);

    throw new Error(
      `Image generation failed (${response.status})`
    );
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || data.choices?.[0]?.message?.content;

  if (!imageUrl) {
    console.error("Grok API Error: No image URL returned.", data);
    throw new Error("Grok API returned invalid response");
  }

  return imageUrl;
}

export async function generateVideo(prompt: string) {
  console.log("Mocking Video Generation for prompt:", prompt);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  // Return a mock vertical stock video
  return "https://videos.pexels.com/video-files/5854496/5854496-uhd_1440_2560_24fps.mp4";
}
