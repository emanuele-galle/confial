import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { id } = await params;

  // Verify notification belongs to user
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== (session.user as { id: string }).id) {
    return NextResponse.json(
      { error: "Notifica non trovata" },
      { status: 404 }
    );
  }

  // Mark as read
  const updated = await prisma.notification.update({
    where: { id },
    data: {
      read: true,
      readAt: new Date(),
    },
  });

  return NextResponse.json({ notification: updated });
}
