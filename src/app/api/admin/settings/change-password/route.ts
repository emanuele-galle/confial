import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password attuale obbligatoria"),
  newPassword: z.string().min(8, "La nuova password deve essere almeno 8 caratteri"),
  confirmPassword: z.string().min(1, "Conferma password obbligatoria"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Le password non corrispondono",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();
  const validationResult = changePasswordSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: validationResult.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = validationResult.data;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });

  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Utente non trovato" },
      { status: 404 }
    );
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    return NextResponse.json(
      { error: "Password attuale non corretta" },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ success: true });
}
