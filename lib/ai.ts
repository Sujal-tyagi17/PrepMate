async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

/** Returns true if the error is a quota/rate-limit error from Gemini */
function isQuotaError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const e = err as any;
    // HTTP 429 from GoogleGenerativeAI
    if (e.status === 429 || e.statusText === "Too Many Requests") return true;
    // Error message match
    const msg: string = e.message ?? "";
    return msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED");
}

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const hasGroq = !!process.env.GROQ_API_KEY &&
        !process.env.GROQ_API_KEY.startsWith("placeholder") &&
        process.env.GROQ_API_KEY.length > 10;

    const hasGemini = !!process.env.GEMINI_API_KEY &&
        !process.env.GEMINI_API_KEY.startsWith("placeholder") &&
        process.env.GEMINI_API_KEY.length > 10;

    // Try Groq FIRST — free tier is very generous (no daily cap)
    if (hasGroq) {
        try {
            return await callGroq(prompt, systemPrompt);
        } catch (err) {
            console.warn("Groq failed, trying Gemini:", (err as any)?.message ?? err);
        }
    }

    // Fall back to Gemini
    if (hasGemini) {
        try {
            return await callGemini(prompt, systemPrompt);
        } catch (err) {
            if (isQuotaError(err)) {
                throw new Error(
                    "AI quota exceeded. Your Gemini free-tier daily limit is used up. " +
                    "Add a GROQ_API_KEY to .env.local for unlimited free requests (https://console.groq.com)."
                );
            }
            console.warn("Gemini failed:", (err as any)?.message ?? err);
            throw err;
        }
    }

    throw new Error(
        "No AI provider configured. Add GROQ_API_KEY (free at https://console.groq.com) " +
        "or GEMINI_API_KEY to .env.local"
    );
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
