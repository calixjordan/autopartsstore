const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing connection...");
    const productsCount = await prisma.product.count();
    console.log("SUCCESS! Connection works. Product count in DB:", productsCount);
  } catch (error) {
    console.error("FAIL! Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
