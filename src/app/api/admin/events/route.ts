import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/schemas/event";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const featured = searchParams.get("featured");

  // Build where clause with filters
  const where: any = {};

  // Search filter (title, description, location)
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Featured filter
  if (featured !== null && featured !== "") {
    where.featured = featured === "true";
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { eventDate: "desc" },
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({
    data: events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();
  const validationResult = createEventSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const { title, eventDate, ...rest } = validationResult.data;

  // Generate slug
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const event = await prisma.event.create({
    data: {
      title,
      slug,
      eventDate: new Date(eventDate),
      ...rest,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
