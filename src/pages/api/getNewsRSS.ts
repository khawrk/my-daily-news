// import { NextResponse } from "next/server";
// import { parseStringPromise } from "xml2js";

// export async function getNewsRSS() {
//   try {
//     // Fetch the BBC RSS feed server-side
//     const response = await fetch("https://feeds.bbci.co.uk/news/world/rss.xml");
//     const xml = await response.text();

//     // Parse XML to JSON
//     const parsedData = await parseStringPromise(xml);

//     // Map the parsed data to your desired format
//     const articles = parsedData.rss.channel[0].item.map((item: any) => ({
//       author: "BBC News",
//       content: item.description[0],
//       description: item.description[0],
//       publishedAt: item.pubDate[0],
//       source: { id: "bbc-news", name: "BBC News" },
//       title: item.title[0],
//       url: item.link[0],
//       urlToImage: item["media:thumbnail"]?.[0]?.$.url || "/default-image.jpg",
//     }));

//     return NextResponse.json({ articles });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch news" },
//       { status: 500 }
//     );
//   }
// }
