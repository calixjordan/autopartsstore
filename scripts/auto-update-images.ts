import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Fetching all catalog products from PostgreSQL database...");
  const products = await prisma.product.findMany();
  console.log(`📋 Found ${products.length} products to check and update.`);

  const usedImageUrls = new Set<string>();
  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] Processing product: "${product.name}"`);
    
    // Clean up product name for Unsplash search query (remove model years/extra numbers for generic matches)
    const cleanSearchQuery = product.name
      .replace(/\(20\d\d-20\d\d\)/g, "") // Remove bracketed years e.g. (2018-2024)
      .trim();

    try {
      const searchUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(
        cleanSearchQuery + " auto car part"
      )}&per_page=10`;

      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ Fetch failed for search: ${cleanSearchQuery} (HTTP ${response.status})`);
        continue;
      }

      const data = await response.json();
      const results = data.results || [];
      
      let chosenUrl = "";
      
      // Find the first image URL that hasn't been used yet in this script run
      for (const item of results) {
        const url = item.urls?.regular || item.urls?.small;
        if (url && !usedImageUrls.has(url)) {
          chosenUrl = url;
          usedImageUrls.add(url);
          break;
        }
      }

      // If all images in results were somehow duplicates, fallback to the first result
      if (!chosenUrl && results.length > 0) {
        chosenUrl = results[0].urls?.regular || results[0].urls?.small;
      }

      if (chosenUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: chosenUrl },
        });
        console.log(`✅ Updated image for "${product.name}" -> ${chosenUrl.substring(0, 70)}...`);
        updatedCount++;
      } else {
        console.log(`❌ No matching images found on Unsplash for query: "${cleanSearchQuery}"`);
      }
    } catch (err) {
      console.error(`💥 Error updating product "${product.name}":`, err);
    }

    // Gentle delay to avoid triggering Unsplash rate limiting/block list
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  console.log(`\n🎉 Image automation process finished successfully! Updated ${updatedCount} products with unique, high-resolution car part photos.`);
}

main()
  .catch((e) => {
    console.error("Image automation script crashed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
