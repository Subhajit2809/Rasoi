import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface DetectedItem {
  name: string;
  qty: number;
  unit: string;
  category: string;
}

const PROMPT = `You are a grocery identification assistant for an Indian kitchen app called Rasoi.

Analyze this photo and identify all grocery/food items visible. For each item:
1. Use the common Indian name (Hindi name in parentheses if applicable), e.g. "Pyaz (Onion)", "Tamatar (Tomato)", "Aloo (Potato)"
2. Estimate the quantity visible
3. Assign appropriate unit: "pcs" for countable items, "kg" for heavy produce, "g" for small quantities, "L" for liquids, "ml" for small liquids, "bunch" for leafy greens
4. Categorize as one of: "Vegetables", "Dairy & Protein", "Pantry"

Respond ONLY with a JSON array. No markdown, no explanation. Example:
[
  {"name": "Pyaz (Onion)", "qty": 4, "unit": "pcs", "category": "Vegetables"},
  {"name": "Paneer", "qty": 200, "unit": "g", "category": "Dairy & Protein"}
]

If no grocery items are visible, respond with an empty array: []`;

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Gemini API key not configured. Add GOOGLE_GEMINI_API_KEY to your environment." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { image } = body as { image?: string };

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Strip data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const text = result.response.text().trim();

    // Parse the JSON response — handle markdown code blocks if present
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const items: DetectedItem[] = JSON.parse(jsonStr);

    // Validate structure
    const validItems = items
      .filter(
        (item) =>
          typeof item.name === "string" &&
          typeof item.qty === "number" &&
          typeof item.unit === "string"
      )
      .map((item) => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        category: item.category || "Pantry",
      }));

    return NextResponse.json({ items: validItems });
  } catch (err) {
    console.error("[photo-to-items] Error:", err);
    const message = err instanceof Error ? err.message : "Failed to analyze image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
