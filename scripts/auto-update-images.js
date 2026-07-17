const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function getKeywordsForPart(partName) {
  const name = partName.toLowerCase();
  if (name.includes("oil filter")) return "oil,filter,engine";
  if (name.includes("spark plug")) return "spark,plug,ignition";
  if (name.includes("air filter")) return "air,filter,car";
  if (name.includes("turbocharger")) return "turbocharger,engine";
  if (name.includes("bumper")) return "bumper,car,body";
  if (name.includes("mirror")) return "mirror,car";
  if (name.includes("wiper")) return "wiper,windshield";
  if (name.includes("brake pads") || name.includes("brake shoe")) return "brake,pads,car";
  if (name.includes("brake disc") || name.includes("rotor")) return "brake,disc,rotor";
  if (name.includes("ecu") || name.includes("control unit")) return "ecu,electronics,board";
  if (name.includes("sensor")) return "sensor,wire,car";
  if (name.includes("alternator")) return "alternator,engine,generator";
  if (name.includes("shock") || name.includes("strut") || name.includes("suspension")) return "suspension,shock,absorber";
  if (name.includes("clutch") || name.includes("flywheel")) return "clutch,transmission,gears";
  if (name.includes("axle") || name.includes("shaft")) return "axle,drive,chassis";
  if (name.includes("radiator") && !name.includes("fan")) return "radiator,car,cooling";
  if (name.includes("fan")) return "cooling,fan,engine";
  if (name.includes("pump")) return "water,pump,engine";
  return "car,part";
}

async function main() {
  console.log("🔍 Fetching all catalog products from PostgreSQL database...");
  const products = await prisma.product.findMany();
  console.log(`📋 Found ${products.length} products to check and update.`);

  let updatedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const keywords = getKeywordsForPart(product.name);
    
    // Generate a unique high-resolution featured Unsplash photo redirect URL using the keywords and seed signature
    const chosenUrl = `https://images.unsplash.com/featured/?${keywords}&sig=${i}`;

    try {
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: chosenUrl },
      });
      console.log(`✅ Updated image for "${product.name}" -> ${chosenUrl}`);
      updatedCount++;
    } catch (err) {
      console.error(`💥 Error updating product "${product.name}":`, err);
    }
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
