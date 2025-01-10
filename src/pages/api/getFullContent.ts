import type { NextApiRequest, NextApiResponse } from "next";
import { getFullContent } from "@/actions/getNews";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  try {
    const content = await getFullContent(url as string);
    res.status(200).json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
