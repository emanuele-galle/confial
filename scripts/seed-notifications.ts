import { prisma } from "../src/lib/prisma";

async function main() {
  // Get first admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("No admin user found. Create one first.");
    process.exit(1);
  }

  console.log(`Creating notifications for user: ${admin.email}`);

  const notifications = [
    {
      userId: admin.id,
      type: "SUCCESS" as const,
      title: "Benvenuto nel sistema di notifiche!",
      message:
        "Il sistema di notifiche è ora attivo. Riceverai aggiornamenti in tempo reale.",
      read: false,
    },
    {
      userId: admin.id,
      type: "INFO" as const,
      title: "Nuova news pubblicata",
      message: "È stata pubblicata una nuova news sul sito.",
      link: "/admin/news",
      read: false,
    },
    {
      userId: admin.id,
      type: "WARNING" as const,
      title: "Evento in scadenza",
      message: "L'evento 'Assemblea Generale' inizierà tra 2 giorni.",
      link: "/admin/events",
      read: false,
    },
    {
      userId: admin.id,
      type: "INFO" as const,
      title: "Nuovo documento caricato",
      message: "Un nuovo documento è stato aggiunto alla libreria.",
      link: "/admin/documents",
      read: true,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
    console.log(`✓ Created: ${notification.title}`);
  }

  console.log("\nNotifications seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
