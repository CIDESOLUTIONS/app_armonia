import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { JWTPayload } from "./auth"; // Importar la interfaz JWTPayload
import { ServerLogger } from "./logging/server-logger";

// En un entorno de producción, esta lista debería venir de una tabla de tenants en la base de datos principal.
const VALID_TENANTS = ["armonia", "tenant_cj0001", "tenant_cj0002"]; // Lista blanca de tenants válidos

const prisma = new PrismaClient();

// Función para validar y sanitizar el schemaName
const getValidSchemaName = (schemaName: string | undefined): string | null => {
  if (!schemaName) return "armonia"; // Devuelve el schema por defecto si no se proporciona

  // Sanitización básica: solo permitir caracteres alfanuméricos y guiones bajos
  const sanitizedSchema = schemaName.replace(/[^a-zA-Z0-9_]/g, "");

  if (VALID_TENANTS.includes(sanitizedSchema)) {
    return sanitizedSchema;
  }

  ServerLogger.warn(
    `Intento de acceso con schemaName inválido o no autorizado: ${schemaName}`,
  );
  return null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        schemaName: { label: "Schema Name", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials;
        const validSchema = getValidSchemaName(credentials.schemaName);

        if (!validSchema) {
          return null; // Schema inválido o no autorizado
        }

        let user = null;
        let targetPrisma = prisma;

        try {
          if (validSchema !== "armonia") {
            const databaseUrl = process.env.DATABASE_URL?.replace(
              "armonia",
              validSchema,
            );
            targetPrisma = new PrismaClient({
              datasources: {
                db: {
                  url: databaseUrl,
                },
              },
            });
          }

          user = await targetPrisma.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            ServerLogger.warn(
              `Intento de login fallido: Usuario no encontrado para ${email} en esquema ${validSchema}`,
            );
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            ServerLogger.warn(
              `Intento de login fallido: Contraseña incorrecta para ${email} en esquema ${validSchema}`,
            );
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            complexId: user.complexId?.toString(),
            schemaName: validSchema,
          };
        } catch (error) {
          ServerLogger.error(
            `Error en la autorización para el esquema ${validSchema}:`,
            error,
          );
          return null;
        } finally {
          if (validSchema !== "armonia") {
            await (targetPrisma as PrismaClient).$disconnect();
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.complexId = user.complexId;
        token.schemaName = user.schemaName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.complexId = token.complexId;
        session.user.schemaName = token.schemaName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
