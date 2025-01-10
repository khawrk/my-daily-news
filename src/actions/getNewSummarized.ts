import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

export async function getNewsSummarized(content: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GEMINI_KEY) {
    throw new Error("GEMINI_KEY is not defined in the environment variables.");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Hi, could you help me summarize the news? This is content: ${content}`;

    const result = await model.generateContent(prompt);
    const textSummary = await result.response.text();
    console.log("Summary received:", textSummary);

    return textSummary;
  } catch (error) {
    console.error("Error summarizing content:", error.message);
    return "Error: Could not summarize the content.";
  }
}

// import OpenAI from "openai";

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function getNewsSummarized(content: string) {
//   try {
//     // Send the news content to OpenAI for summarization
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful assistant that summarizes articles concisely.",
//         },
//         {
//           role: "user",
//           content: `Please summarize the following article:\n\n${content}`,
//         },
//       ],
//     });

//     // Return the summarized text
//     return completion.choices[0].message?.content;
//   } catch (error) {
//     console.error("Error summarizing news:", error);
//     throw new Error("Failed to get summarized news.");
//   }
// }
