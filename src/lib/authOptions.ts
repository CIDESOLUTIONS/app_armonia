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
        rememberMe: { label: "Remember Me", type: "checkbox" }, // Añadir rememberMe
        schemaName: { label: "Schema Name", type: "text", optional: true },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password, schemaName, rememberMe } = credentials;
        const publicPrisma = getPublicPrismaClient();

        let user = null;

        try {
          user = await publicPrisma.user.findUnique({
            where: { email: email },
            include: { complex: true },
          });

          const ipAddress = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || 'unknown';

          if (!user) {
            ServerLogger.warn(
              `Intento de login fallido: Usuario no encontrado para ${email}`,
            );
            await publicPrisma.loginHistory.create({
              data: {
                email: email,
                timestamp: new Date(),
                ipAddress: ipAddress,
                userAgent: userAgent,
                status: "FAILED",
                reason: "User not found",
              },
            });
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            ServerLogger.warn(
              `Intento de login fallido: Contraseña incorrecta para ${email}`,
            );
            await publicPrisma.loginHistory.create({
              data: {
                email: email,
                userId: user.id,
                timestamp: new Date(),
                ipAddress: ipAddress,
                userAgent: userAgent,
                status: "FAILED",
                reason: "Incorrect password",
              },
            });
            return null;
          }

          try {
            await publicPrisma.loginHistory.create({
              data: {
                userId: user.id,
                email: email,
                timestamp: new Date(),
                ipAddress: ipAddress,
                userAgent: userAgent,
                status: "SUCCESS",
              },
            });
            ServerLogger.info(`Inicio de sesión exitoso para ${email} desde ${ipAddress}`);
          } catch (logError) {
            ServerLogger.error(`Error al registrar el historial de login para ${email}:`, logError);
          }

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
            schemaName: user.complex?.schemaName || null,
            rememberMe: rememberMe,
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.complexId = user.complexId;
        token.schemaName = (user as any).schemaName;
        token.rememberMe = (user as any).rememberMe;
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
      // Si rememberMe no es true, la sesión expirará cuando se cierre el navegador
      if (!token.rememberMe) {
        session.expires = ""; // Esto hará que la cookie sea de sesión
      }
      return session;
    },
  },
  pages: {
    signIn: "/public/login",
    error: "/public/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
