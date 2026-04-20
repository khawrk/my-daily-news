"use server";
import OpenAI from "openai";

export async function getNewsSummarized(content: string): Promise<string> {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY is not defined in the environment variables.");
	}

	try {
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "user",
					content: `Please summarize the following news content concisely:\n\n${content}`,
				},
			],
		});

		return response.choices[0]?.message?.content ?? "";
	} catch (error: unknown) {
		console.error("Error summarizing content:", error instanceof Error ? error.message : error);
		return "Error: Could not summarize the content.";
	}
}
