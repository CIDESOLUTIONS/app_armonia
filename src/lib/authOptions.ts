import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { JWTPayload } from "./auth";
import { ServerLogger } from "./logging/server-logger";
import { getPublicPrismaClient } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        schemaName: { label: "Schema Name", type: "text", optional: true }, // schemaName ahora es opcional en las credenciales
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password, schemaName } = credentials;
        const publicPrisma = getPublicPrismaClient();

        let user = null;

        try {
          user = await publicPrisma.user.findUnique({
            where: { email: email },
            include: { complex: true }, // Incluir la relación con ResidentialComplex
          });

          if (!user) {
            ServerLogger.warn(
              `Intento de login fallido: Usuario no encontrado para ${email}`,
            );
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            ServerLogger.warn(
              `Intento de login fallido: Contraseña incorrecta para ${email}`,
            );
            return null;
          }

          // Validar que el usuario pertenece al schemaName proporcionado (si aplica)
          if (
            user.complexId &&
            schemaName &&
            user.complex?.schemaName !== schemaName
          ) {
            ServerLogger.warn(
              `Intento de login fallido: Usuario ${email} no pertenece al schema ${schemaName}`,
            );
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            complexId: user.complexId?.toString(),
            schemaName: user.complex?.schemaName || null, // Usar el schemaName del complejo asociado
          };
        } catch (error) {
          ServerLogger.error(`Error en la autorización para ${email}:`, error);
          return null;
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
        token.schemaName = (user as any).schemaName; // Asegurar que schemaName se propague
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
        session.user.schemaName = token.schemaName; // Asegurar que schemaName se propague
      }
      return session;
    },
  },
  pages: {
    signIn: "/public/login", // Asegurar que la ruta de signIn sea correcta
    error: "/public/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
