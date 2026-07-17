import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    // Search Unsplash public API with auto-part keyword appended for relevancy
    const searchUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(
      query + " car auto part"
    )}&per_page=8`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash NAPI responded with status: ${response.status}`);
    }

    const data = await response.json();
    const photos = (data.results || []).map((item: any) => ({
      id: item.id,
      url: item.urls?.regular || item.urls?.small,
      thumb: item.urls?.thumb || item.urls?.small,
      description: item.alt_description || item.description || "Car Part",
    }));

    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error("Auto image search error:", error);
    // Fallback: Return a default set of high quality placeholder car part images
    const fallbackPhotos = [
      {
        id: "fb1",
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80",
        thumb: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&auto=format&fit=crop&q=80",
        description: "Engine Parts",
      },
      {
        id: "fb2",
        url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
        thumb: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=200&auto=format&fit=crop&q=80",
        description: "Brake Rotor",
      },
      {
        id: "fb3",
        url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
        thumb: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=200&auto=format&fit=crop&q=80",
        description: "Car wheel alloy",
      },
      {
        id: "fb4",
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
        thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop&q=80",
        description: "Brake Calipers",
      }
    ];
    return NextResponse.json({ photos: fallbackPhotos });
  }
}
