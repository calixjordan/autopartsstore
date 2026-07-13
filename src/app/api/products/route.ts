import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const make = searchParams.get("make"); // e.g. "Toyota"
    const model = searchParams.get("model"); // e.g. "Corolla"
    const year = searchParams.get("year"); // e.g. "2022"
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const skip = (page - 1) * pageSize;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (make && model) {
      where.compatibleModels = {
        contains: `${make} ${model}`,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { partNumber: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    // Since we need to run complex range matching on years (which is in JSON string format), 
    // we query matched models from SQL and then filter precisely in Node memory.
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    // Parse compatibleModels JSON string to array
    let products = rawProducts.map((p) => ({
      ...p,
      compatibleModels: JSON.parse(p.compatibleModels) as string[],
    }));

    // Filter precisely by year if provided
    if (make && model && year) {
      const queryYear = parseInt(year);
      const searchTarget = `${make} ${model}`.toLowerCase();
      
      products = products.filter((p) => {
        return p.compatibleModels.some((compat) => {
          if (!compat.toLowerCase().includes(searchTarget)) return false;
          
          // Parse YYYY-YYYY format: e.g. "Toyota Corolla (2018-2024)"
          const match = compat.match(/\((\d{4})-(\d{4})\)/);
          if (match) {
            const start = parseInt(match[1]);
            const end = parseInt(match[2]);
            return queryYear >= start && queryYear <= end;
          }
          return true;
        });
      });
    }

    // Apply pagination in memory if fitment filters reduced list size, or serve slice
    const paginatedProducts = products.slice(skip, skip + pageSize);

    return NextResponse.json({
      products: paginatedProducts,
      total: products.length,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[API /products] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
