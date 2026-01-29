import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTemplateSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional(),
  category: z.string().default("generale"),
  entityType: z.enum(["news", "events"], {
    errorMap: () => ({ message: "Tipo entità non valido" }),
  }),
  content: z.object({
    title: z.string().optional(),
    excerpt: z.string().optional(),
    body: z.string(),
    category: z.string().optional(),
    location: z.string().optional(),
  }),
});

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");
  const category = searchParams.get("category");

  const where: any = {};

  if (entityType) {
    where.entityType = entityType;
  }

  if (category && category !== "tutti") {
    where.category = category;
  }

  const templates = await prisma.contentTemplate.findMany({
    where,
    orderBy: [{ category: "asc" }, { name: "asc" }],
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ templates });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createTemplateSchema.parse(body);

    const template = await prisma.contentTemplate.create({
      data: {
        name: validated.name,
        description: validated.description,
        category: validated.category,
        entityType: validated.entityType,
        content: validated.content,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dati non validi", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Errore nella creazione del template" },
      { status: 500 }
    );
  }
}
