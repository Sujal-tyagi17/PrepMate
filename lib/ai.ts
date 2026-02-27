async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\n${prompt}`
        : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text().trim();
}

async function callGroq(prompt: string, systemPrompt?: string): Promise<string> {
    const Groq = (await import("groq-sdk")).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const messages: Array<{ role: "system" | "user"; content: string }> = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content?.trim() ?? "";
}


export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const hasGemini = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith("placeholder");
    const hasGroq = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith("placeholder");

    if (hasGemini) {
        try {
            return await callGemini(prompt, systemPrompt);
        } catch (err) {
            console.warn("Gemini failed, trying Groq:", err);
        }
    }

    if (hasGroq) {
        try {
            return await callGroq(prompt, systemPrompt);
        } catch (err) {
            console.warn("Groq failed:", err);
            throw new Error("All AI providers failed. Please add GEMINI_API_KEY or GROQ_API_KEY to .env.local");
        }
    }

    throw new Error("No AI provider configured. Add GEMINI_API_KEY or GROQ_API_KEY to .env.local");
}

/** Helper that extracts JSON from the AI response (handles code fences) */
export async function generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    // Add explicit JSON instruction to the prompt
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON. No explanations, no markdown code blocks, just raw JSON.`;
    const raw = await generateText(jsonPrompt, systemPrompt);

    // Strip markdown code fences if present
    const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

    return JSON.parse(cleaned) as T;
}
