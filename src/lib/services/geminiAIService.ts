// Gemini AI Service for Air Quality Assistant

const API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyBtrCrYDgq9boT0qPsmPNKhbYSjejGtiUk"; // Fallback for development
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

class GeminiAIService {
  private systemPrompt = `You are an Air Quality Assistant for an environmental monitoring application. Your role is to help users understand:

1. Air pollution and its health impacts
2. Air quality measurements (AQI, PM2.5, PM10, CO, NO2, O3, SO2)
3. Gas sensor readings (CO, H2S, CH4, O2 levels)
4. Health recommendations based on air quality
5. Environmental monitoring best practices

Keep responses helpful, accurate, and concise. Focus on practical advice and clear explanations. When discussing health impacts, always recommend consulting healthcare professionals for serious concerns.

Context: This app monitors real-time air quality with sensors measuring CO (Carbon Monoxide), H2S (Hydrogen Sulfide), CH4 (Methane), and O2 (Oxygen) levels.`;

  async sendMessage(
    userMessage: string,
    conversationHistory?: ChatMessage[]
  ): Promise<string> {
    try {
      // Build conversation context
      let contextualPrompt = this.systemPrompt;

      if (conversationHistory && conversationHistory.length > 0) {
        contextualPrompt += "\n\nConversation history:\n";
        conversationHistory.slice(-5).forEach((msg) => {
          contextualPrompt += `${msg.role}: ${msg.content}\n`;
        });
      }

      contextualPrompt += `\nUser question: ${userMessage}`;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: contextualPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
            candidateCount: 1,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated from AI");
      }

      const aiResponse = data.candidates[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error("Invalid response format from AI");
      }

      return aiResponse.trim();
    } catch (error) {
      console.error("Gemini AI Service Error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API error: 429")) {
          return "I'm receiving too many requests right now. Please wait a moment and try again.";
        } else if (error.message.includes("API error: 403")) {
          return "Sorry, there's an authentication issue with the AI service. Please contact support.";
        } else if (error.message.includes("network")) {
          return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
        }
      }

      return "Sorry, I encountered an unexpected error. Please try rephrasing your question or try again later.";
    }
  }

  // Get suggested questions for air quality topics
  getSuggestedQuestions(): string[] {
    return [
      "What does AQI mean and how is it calculated?",
      "What are safe levels for CO and H2S?",
      "How does air pollution affect my health?",
      "What should I do when air quality is hazardous?",
      "How do I interpret gas sensor readings?",
      "What's the difference between PM2.5 and PM10?",
      "How can I protect myself from air pollution?",
      "What causes high CO levels indoors?",
    ];
  }

  // Format air quality data for AI context
  formatAirQualityContext(sensorData: any): string {
    if (!sensorData) return "";

    return `Current sensor readings:
- CO (Carbon Monoxide): ${sensorData.co_ppm || "N/A"} ppm
- H2S (Hydrogen Sulfide): ${sensorData.h2s_ppm || "N/A"} ppm  
- CH4 (Methane): ${sensorData.ch4_ppm || "N/A"} ppm
- O2 (Oxygen): ${sensorData.o2_percent || "N/A"}%
- Air Quality Level: ${sensorData.quality_description || "N/A"}`;
  }
}

export const geminiAIService = new GeminiAIService();
