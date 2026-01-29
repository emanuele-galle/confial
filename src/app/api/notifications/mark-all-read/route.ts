import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  // Mark all unread notifications as read
  const result = await prisma.notification.updateMany({
    where: {
      userId: (session.user as any).id,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  });

  return NextResponse.json({ count: result.count });
}
