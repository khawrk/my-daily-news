import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

export async function getNewsSummarized(content: string): Promise<string> {
	if (!process.env.NEXT_PUBLIC_GEMINI_KEY) {
		throw new Error("GEMINI_KEY is not defined in the environment variables.");
	}

	try {
		const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `Hi, could you help me summarize the news? This is content: ${content}`;

		const result = await model.generateContent(prompt);
		const textSummary = await result.response.text();

		return textSummary;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error summarizing content:", error.message);
			return "Error: Could not summarize the content.";
		}
	}
	return "";
}
