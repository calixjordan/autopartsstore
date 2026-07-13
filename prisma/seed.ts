import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Comprehensive brand and model matrix spanning global manufacturers
const brandModels: Record<string, { models: string[]; country: string; oemName: string }> = {
  Toyota: {
    models: ["Corolla", "Camry", "RAV4", "Fortuner", "Innova Hycross", "Land Cruiser", "Yaris"],
    country: "Japan",
    oemName: "Toyota Genuine Parts",
  },
  Honda: {
    models: ["City", "Civic", "Accord", "CR-V", "Amaze", "Jazz", "WR-V"],
    country: "Japan",
    oemName: "Honda Genuine Accessories",
  },
  BMW: {
    models: ["3 Series", "5 Series", "7 Series", "X3", "X5", "M3", "i4"],
    country: "Germany",
    oemName: "BMW M Performance Parts",
  },
  "Mercedes-Benz": {
    models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "CLA", "EQS"],
    country: "Germany",
    oemName: "Mercedes-Benz Genuine Parts",
  },
  Volkswagen: {
    models: ["Polo", "Golf", "Tiguan", "Passat", "Taigun", "Virtus"],
    country: "Germany",
    oemName: "VW Genuine Parts",
  },
  Ford: {
    models: ["Mustang", "F-150", "Explorer", "EcoSport", "Endeavour", "Fiesta"],
    country: "USA",
    oemName: "Motorcraft OEM",
  },
  Hyundai: {
    models: ["Creta", "i20", "Verna", "Venue", "Tucson", "Elantra", "Alcazar"],
    country: "South Korea",
    oemName: "Hyundai MOBIS Genuine Parts",
  },
  Tata: {
    models: ["Nexon", "Harrier", "Safari", "Altroz", "Tiago", "Punch", "Curvv"],
    country: "India",
    oemName: "Tata Genuine Parts",
  },
  Mahindra: {
    models: ["Thar", "Scorpio-N", "XUV700", "Bolero", "Scorpio Classic", "XUV300"],
    country: "India",
    oemName: "Mahindra M-Hawk Parts",
  },
  Tesla: {
    models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
    country: "USA",
    oemName: "Tesla OEM Parts",
  },
  Audi: {
    models: ["A4", "A6", "A8", "Q3", "Q5", "Q7", "e-tron"],
    country: "Germany",
    oemName: "Audi Genuine Parts",
  },
  Nissan: {
    models: ["Magnite", "Kicks", "GT-R", "Sunny", "Altima", "Patrol"],
    country: "Japan",
    oemName: "Nissan Genuine OEM",
  },
  Porsche: {
    models: ["911 Carrera", "Cayenne", "Macan", "Panamera", "Taycan", "Cayman"],
    country: "Germany",
    oemName: "Porsche Tequipment Parts",
  },
};

// Part templates across all 7 website categories
const partTemplates = [
  // ── ENGINE ──
  {
    category: "Engine",
    partName: "High-Efficiency Oil Filter",
    desc: "Provides maximum lubrication filtration to capture micron-level dirt and contaminants. Recommended replacement every 10,000 km.",
    minPrice: 350,
    maxPrice: 1200,
    pnPrefix: "16510",
  },
  {
    category: "Engine",
    partName: "Iridium Spark Plug Set (4 pcs)",
    desc: "Laser-welded iridium electrode tip offers outstanding combustion stability, cleaner start-up, and sustained fuel efficiency.",
    minPrice: 1200,
    maxPrice: 3500,
    pnPrefix: "33401",
  },
  {
    category: "Engine",
    partName: "Performance Engine Air Filter",
    desc: "Optimizes volumetric air flow while providing maximum barrier protection against road dust and combustion debris.",
    minPrice: 500,
    maxPrice: 2000,
    pnPrefix: "13780",
  },
  {
    category: "Engine",
    partName: "Heavy Duty Turbocharger Assembly",
    desc: "Precision balanced rotor assembly restores maximum engine boost, throttle response, and horsepower. Fits specific turbocharged models.",
    minPrice: 24000,
    maxPrice: 58000,
    pnPrefix: "53039",
  },

  // ── EXTERIOR ──
  {
    category: "Exterior",
    partName: "Front Bumper Cover Assembly",
    desc: "Manufactured from high-impact polypropylene. Features pre-drilled OEM mounting points and factory prime coat ready for painting.",
    minPrice: 4800,
    maxPrice: 16500,
    pnPrefix: "71711",
  },
  {
    category: "Exterior",
    partName: "Electric Folding Side Mirror (Left)",
    desc: "Complete ORVM assembly with integrated dynamic LED turn indicator, heater element, and automatic tilt-down motor.",
    minPrice: 3500,
    maxPrice: 9800,
    pnPrefix: "84702",
  },
  {
    category: "Exterior",
    partName: "Aerodynamic Front Wiper Blades (Set)",
    desc: "Dual-shield silicone compound wiper blades for streak-free rain clearing and high durability against intense UV exposure.",
    minPrice: 650,
    maxPrice: 1800,
    pnPrefix: "38340",
  },

  // ── BRAKES ──
  {
    category: "Brakes",
    partName: "Premium Ceramic Front Brake Pads",
    desc: "Low-dust, low-noise brake pad kit. High-coefficient friction lining delivers steady braking power under high temperatures.",
    minPrice: 990,
    maxPrice: 4500,
    pnPrefix: "55810",
  },
  {
    category: "Brakes",
    partName: "Ventilated Front Brake Disc Rotor",
    desc: "Cross-drilled and slotted thermal-balanced rotor for maximum heat dissipation. Minimizes brake fade and pad wear.",
    minPrice: 1950,
    maxPrice: 8500,
    pnPrefix: "55211",
  },
  {
    category: "Brakes",
    partName: "Rear Drum Brake Shoe Set",
    desc: "OEM-formulated bonded lining rear brake shoes. High dimensional accuracy provides quick, balanced response.",
    minPrice: 800,
    maxPrice: 2600,
    pnPrefix: "56200",
  },

  // ── ELECTRONICS ──
  {
    category: "Electronics",
    partName: "Engine Control Unit (ECU)",
    desc: "Factory-calibrated digital engine mapping module. Plug-and-play unit designed for vehicle immobilizer configuration.",
    minPrice: 15500,
    maxPrice: 48000,
    pnPrefix: "33920",
  },
  {
    category: "Electronics",
    partName: "ABS Wheel Speed Sensor (Front-Right)",
    desc: "High-precision electromagnetic wheel rotation sensor. Restores standard anti-lock braking and traction control cycles.",
    minPrice: 1400,
    maxPrice: 4200,
    pnPrefix: "56210",
  },
  {
    category: "Electronics",
    partName: "Alternator Assembly (90A)",
    desc: "Premium grade high-output alternator. Delivers steady, efficient charging for heavy electrical demands and accessories.",
    minPrice: 5900,
    maxPrice: 14500,
    pnPrefix: "31400",
  },

  // ── SUSPENSION ──
  {
    category: "Suspension",
    partName: "Gas-Charged Shock Absorbers (Pair)",
    desc: "Premium pressurized twin-tube gas shocks. Eliminates body roll, restores factory handling profile and highway stability.",
    minPrice: 4500,
    maxPrice: 18900,
    pnPrefix: "41600",
  },
  {
    category: "Suspension",
    partName: "Strut Mount & Bearing Repair Kit",
    desc: "Restores smooth steering input. Eliminates strut knocking noises over potholes. Includes top rubber mount and ball bearing.",
    minPrice: 1200,
    maxPrice: 3800,
    pnPrefix: "41741",
  },

  // ── TRANSMISSION ──
  {
    category: "Transmission",
    partName: "Full Clutch Kit & Flywheel Set",
    desc: "Includes heavy duty friction disc plate, pressure plate, and throw-out release bearing. Provides smooth shifting transition.",
    minPrice: 4900,
    maxPrice: 19500,
    pnPrefix: "22000",
  },
  {
    category: "Transmission",
    partName: "Premium CV Axle Drive Shaft",
    desc: "Made of high-strength forged steel with heavy-duty neoprene grease boots. Prevents vibrations and binding on tight steering angles.",
    minPrice: 3800,
    maxPrice: 12000,
    pnPrefix: "44101",
  },

  // ── COOLING ──
  {
    category: "Cooling",
    partName: "Dual-Pass Aluminum Radiator Core",
    desc: "High density cooling fin configuration. Maximizes coolant thermal heat transfer to prevent engine overheating.",
    minPrice: 3900,
    maxPrice: 12800,
    pnPrefix: "25310",
  },
  {
    category: "Cooling",
    partName: "Radiator Cooling Fan Motor Assembly",
    desc: "High volume air suction fan. Direct fit design with quiet motor bearings and heavy-duty radiator shroud.",
    minPrice: 2800,
    maxPrice: 7900,
    pnPrefix: "52210",
  },
  {
    category: "Cooling",
    partName: "High-Flow Engine Water Pump",
    desc: "Heavy-duty cast alloy impeller pump. Assures continuous coolant circulation under all operating speeds.",
    minPrice: 1600,
    maxPrice: 4900,
    pnPrefix: "17400",
  },
];

// Pre-defined high quality stock images to loop over per category
const categoryImages: Record<string, string[]> = {
  Engine: [
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635784063996-ec25efdb1d57?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
  ],
  Exterior: [
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
  ],
  Brakes: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
  ],
  Suspension: [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80",
  ],
  Transmission: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
  ],
  Cooling: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
  ],
};

async function main() {
  console.log("🌱 Starting generator to create global car brands catalogue database...");

  // Clear existing database records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const generatedProducts = [];
  let partCounter = 1000;

  // Outer loop: iterate over every supported international car manufacturer
  for (const [brand, data] of Object.entries(brandModels)) {
    const primaryModel = data.models[0];
    const secondaryModel = data.models[1] || data.models[0];
    const tertiaryModel = data.models[2] || data.models[0];

    // Inner loop: generate a catalog part for each template
    for (const template of partTemplates) {
      // Create a highly realistic product name: e.g. "Toyota Corolla High-Efficiency Oil Filter"
      const productName = `${brand} ${primaryModel} ${template.partName}`;
      
      // Select an image from the pool
      const images = categoryImages[template.category] || categoryImages.Engine;
      const imageUrl = images[partCounter % images.length];

      // Dynamically calculate a realistic price range based on car class
      let multiplier = 1.0;
      if (data.country === "Germany") multiplier = 2.2; // BMW, Mercedes, Porsche parts cost more
      if (brand === "Porsche") multiplier = 3.5;
      if (brand === "Tesla") multiplier = 2.0;

      const basePrice = Math.floor(
        template.minPrice + Math.random() * (template.maxPrice - template.minPrice)
      );
      const finalPrice = Math.floor(basePrice * multiplier);

      // Generate a realistic OEM Part Number: e.g. "TY-16510-CO-8501"
      const brandCode = brand.substring(0, 2).toUpperCase();
      const modelCode = primaryModel.substring(0, 2).toUpperCase();
      const partNumber = `${brandCode}-${template.pnPrefix}-${modelCode}-${partCounter}`;

      // Assemble compatibility lists
      const compatibleList = [
        `${brand} ${primaryModel} (2018-2024)`,
        `${brand} ${secondaryModel} (2019-2024)`,
        `${brand} ${tertiaryModel} (2020-2024)`,
      ];

      // Assemble final DB record payload
      generatedProducts.push({
        name: productName,
        description: `Premium ${template.partName} for ${brand} vehicles. ${template.desc} Engineered to match or exceed strict OEM factory design guidelines. Built with durability and high performance in mind.`,
        price: finalPrice,
        imageUrl: imageUrl,
        partNumber: partNumber,
        category: template.category,
        brand: data.oemName,
        compatibleModels: JSON.stringify(compatibleList),
        stock: Math.floor(2 + Math.random() * 45), // 2 to 47 items in stock
        rating: parseFloat((4.1 + Math.random() * 0.8).toFixed(1)), // 4.1 to 4.9 stars
        reviewCount: Math.floor(5 + Math.random() * 140),
      });

      partCounter++;
    }
  }

  // Insert generated data to DB in bulk
  let insertedCount = 0;
  for (const product of generatedProducts) {
    await prisma.product.create({ data: product });
    insertedCount++;
  }

  console.log(`\n🎉 Generated and seeded ${insertedCount} global car parts in the catalogue database successfully!`);
}

main()
  .catch((e) => {
    console.error("Generator Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
