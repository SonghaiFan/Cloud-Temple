import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBlessing = async (userWish: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "心诚则灵。 (Please configure API Key)";

  try {
    const prompt = `
      You are a wise, compassionate Buddhist master in a serene temple. 
      The user has come to pray with this thought: "${userWish}".
      
      Please provide a response in Chinese (Traditional or Simplified matching the input) that:
      1. Acknowledges their feeling with empathy.
      2. Offers a brief, deep Buddhist philosophical insight (Dharma) related to their wish (e.g., impermanence, compassion, letting go, cause and effect).
      3. Ends with a gentle blessing.
      
      Keep the tone calm, poetic, and transcendent. Limit to 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "阿弥陀佛，愿施主内心安宁。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "云深不知处，愿施主哪怕在无声中也能寻得片刻宁静。 (Connection Error)";
  }
};

export const generateBuddhaImage = async (): Promise<string | null> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ 
          text: "A majestic golden Buddha statue in meditation, front facing, centered, isolated on black background, dramatic cinematic lighting, rim light, volumetric fog, hyperrealistic, 8k resolution, divine atmosphere, spiritual, glowing aura." 
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part && part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};