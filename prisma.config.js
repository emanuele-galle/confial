import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://confial_user:xK9mNpL2vQ7wR4tY8uZ3aB6cD0eF5gH1@127.0.0.1:5441/confial_db",
  },
});
