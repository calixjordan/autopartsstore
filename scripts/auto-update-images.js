const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const brandModels = {
  Toyota: ["Corolla", "Camry", "RAV4", "Fortuner", "Innova Hycross", "Land Cruiser", "Yaris"],
  Honda: ["City", "Civic", "Accord", "CR-V", "Amaze", "Jazz", "WR-V"],
  BMW: ["3 Series", "5 Series", "7 Series", "X3", "X5", "M3", "i4"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "CLA", "EQS"],
  Volkswagen: ["Polo", "Golf", "Tiguan", "Passat", "Taigun", "Virtus"],
  Ford: ["Mustang", "F-150", "Explorer", "EcoSport", "Endeavour", "Fiesta"],
  Hyundai: ["Creta", "i20", "Verna", "Venue", "Tucson", "Elantra", "Alcazar"],
  Tata: ["Nexon", "Harrier", "Safari", "Altroz", "Tiago", "Punch", "Curvv"],
  Mahindra: ["Thar", "Scorpio-N", "XUV700", "Bolero", "Scorpio Classic", "XUV300"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  Audi: ["A4", "A6", "A8", "Q3", "Q5", "Q7", "e-tron"],
  Nissan: ["Magnite", "Kicks", "GT-R", "Sunny", "Altima", "Patrol"],
  Porsche: ["911 Carrera", "Cayenne", "Macan", "Panamera", "Taycan", "Cayman"]
};

// Curated default high-quality Unsplash fallbacks per category
const categoryFallbacks = {
  Engine: [
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635784063996-ec25efdb1d57?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80"
  ],
  Brakes: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
  ],
  Suspension: [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80"
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80"
  ],
  Cooling: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80"
  ],
  Transmission: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"
  ],
  Exterior: [
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80"
  ]
};

function parseProductBrandModel(productName) {
  for (const [brand, models] of Object.entries(brandModels)) {
    if (productName.startsWith(brand)) {
      // Find matching model
      for (const model of models) {
        if (productName.substring(brand.length).trim().startsWith(model)) {
          return { brand, model };
        }
      }
    }
  }
  return null;
}

function getCategorySearchSuffix(category) {
  switch (category) {
    case "Engine": return "engine";
    case "Brakes": return "wheel brake";
    case "Suspension": return "suspension";
    case "Electronics": return "dashboard interior";
    case "Cooling": return "radiator engine";
    case "Transmission": return "gearbox transmission";
    case "Exterior": return "headlight bumper";
    default: return "";
  }
}

async function fetchWikiImages(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.query?.pages || {};
    const urls = [];
    for (const key in pages) {
      const page = pages[key];
      const imgUrl = page.imageinfo?.[0]?.url;
      if (imgUrl && (imgUrl.toLowerCase().endsWith(".jpg") || imgUrl.toLowerCase().endsWith(".jpeg") || imgUrl.toLowerCase().endsWith(".png"))) {
        urls.push(imgUrl);
      }
    }
    return urls;
  } catch {
    return [];
  }
}

async function main() {
  console.log("🔍 Fetching all catalog products from database...");
  const products = await prisma.product.findMany();
  console.log(`📋 Found ${products.length} products to map with specific car images.`);

  // Cache to store fetched image arrays per query to reduce API load
  const imageCache = new Map();
  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const match = parseProductBrandModel(product.name);
    let chosenUrl = "";

    if (match) {
      const { brand, model } = match;
      const suffix = getCategorySearchSuffix(product.category);
      
      // Try specific search first: e.g. "Porsche 911 engine"
      const specificQuery = `${brand} ${model} ${suffix}`;
      const generalQuery = `${brand} ${model}`;

      let imageUrls = [];

      // Look in cache first
      if (imageCache.has(specificQuery)) {
        imageUrls = imageCache.get(specificQuery);
      } else {
        imageUrls = await fetchWikiImages(specificQuery);
        imageCache.set(specificQuery, imageUrls);
        await new Promise((r) => setTimeout(r, 150)); // Be gentle
      }

      // If specific search failed, try general car query
      if (imageUrls.length === 0) {
        if (imageCache.has(generalQuery)) {
          imageUrls = imageCache.get(generalQuery);
        } else {
          imageUrls = await fetchWikiImages(generalQuery);
          imageCache.set(generalQuery, imageUrls);
          await new Promise((r) => setTimeout(r, 150)); // Be gentle
        }
      }

      if (imageUrls.length > 0) {
        // Distribute images uniquely based on loop index to avoid same image for all parts of the same model
        chosenUrl = imageUrls[i % imageUrls.length];
      }
    }

    // Fallback if no images found from search
    if (!chosenUrl) {
      const pool = categoryFallbacks[product.category] || categoryFallbacks.Engine;
      chosenUrl = pool[i % pool.length];
      console.log(`⚠️ Fallback used for: "${product.name}"`);
    }

    try {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: chosenUrl }
      });
      console.log(`✅ [${i + 1}/${products.length}] ${product.name} -> ${chosenUrl}`);
      updatedCount++;
    } catch (err) {
      console.error(`💥 Error updating: "${product.name}"`, err);
    }
  }

  console.log(`\n🎉 Image automation process completed. Updated ${updatedCount} products with specific car models & parts images!`);
}

main()
  .catch((e) => {
    console.error("Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
