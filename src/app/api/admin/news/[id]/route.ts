import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateNewsSchema } from "@/lib/schemas/news";
import { logAction } from "@/lib/audit-log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!news) {
    return NextResponse.json({ error: "News non trovata" }, { status: 404 });
  }

  return NextResponse.json(news);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();
  const validationResult = updateNewsSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  // Fetch old values for audit log
  const oldNews = await prisma.news.findUnique({ where: { id } });

  const news = await prisma.news.update({
    where: { id },
    data: validationResult.data,
  });

  // Log action
  if (oldNews) {
    await logAction({
      userId: (session.user as any).id,
      action: "UPDATE",
      entityType: "news",
      entityId: id,
      oldValues: oldNews,
      newValues: news,
      req: request,
    });
  }

  return NextResponse.json(news);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch for audit log
  const news = await prisma.news.findUnique({ where: { id } });

  await prisma.news.delete({
    where: { id },
  });

  // Log action
  if (news) {
    await logAction({
      userId: (session.user as any).id,
      action: "DELETE",
      entityType: "news",
      entityId: id,
      oldValues: news,
      req: request,
    });
  }

  return NextResponse.json({ success: true });
}
