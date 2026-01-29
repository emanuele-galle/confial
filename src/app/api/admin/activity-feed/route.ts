import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 30; // 30 seconds cache for activity feed

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    // Fetch audit logs with cursor pagination
    const auditLogs = await prisma.auditLog.findMany({
      take: limit + 1, // Take one extra to determine if there are more items
      orderBy: { createdAt: "desc" as const },
      include: {
        user: {
          select: { name: true },
        },
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor item itself
      }),
    });

    // Determine if there are more items
    const hasMore = auditLogs.length > limit;
    const items = hasMore ? auditLogs.slice(0, limit) : auditLogs;

    // Get next cursor (last item's ID)
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    // Format response
    const response = {
      items: items.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        createdAt: log.createdAt.toISOString(),
        user: {
          name: log.user.name,
        },
      })),
      nextCursor,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Activity feed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity feed" },
      { status: 500 }
    );
  }
}
