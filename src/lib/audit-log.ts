import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
export type AuditEntityType = "news" | "events" | "documents" | "users";

interface LogActionParams {
  userId: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  req: NextRequest;
}

export async function logAction(params: LogActionParams) {
  try {
    const ipAddress =
      params.req.headers.get("x-forwarded-for") ||
      params.req.headers.get("x-real-ip") ||
      null;
    const userAgent = params.req.headers.get("user-agent") || null;

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: params.oldValues ? JSON.stringify(params.oldValues) : null,
        newValues: params.newValues ? JSON.stringify(params.newValues) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Don't fail the main operation if audit log fails
    console.error("Audit log error:", error);
  }
}

// Helper to sanitize sensitive data before logging
export function sanitizeValues(data: Record<string, any>): Record<string, any> {
  const sanitized = { ...data };
  const sensitiveKeys = ["password", "token", "secret", "apiKey"];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    }
  }

  return sanitized;
}
