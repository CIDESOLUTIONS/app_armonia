var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ServerLogger } from './logging/server-logger';
const prisma = new PrismaClient();
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
                schemaName: { label: 'Schema Name', type: 'text', optional: true },
            },
            authorize(credentials, req) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                        return null;
                    }
                    const { email, password, schemaName } = credentials;
                    let user = null;
                    let targetPrisma = prisma;
                    try {
                        if (schemaName) {
                            // Conectar a un esquema específico si se proporciona
                            targetPrisma = new PrismaClient({
                                datasources: {
                                    db: { url: (_a = process.env.DATABASE_URL) === null || _a === void 0 ? void 0 : _a.replace('armonia', schemaName) },
                                },
                            });
                        }
                        user = yield targetPrisma.user.findUnique({
                            where: { email: email },
                        });
                        if (!user) {
                            ServerLogger.warn(`Intento de login fallido: Usuario no encontrado para ${email} en esquema ${schemaName || 'principal'}`);
                            return null;
                        }
                        const passwordMatch = yield bcrypt.compare(password, user.password);
                        if (!passwordMatch) {
                            ServerLogger.warn(`Intento de login fallido: Contraseña incorrecta para ${email} en esquema ${schemaName || 'principal'}`);
                            return null;
                        }
                        // Devolver el usuario si la autenticación es exitosa
                        // NextAuth serializará este objeto en el JWT
                        return {
                            id: user.id.toString(), // ID debe ser string
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            complexId: (_b = user.complexId) === null || _b === void 0 ? void 0 : _b.toString(), // Convertir a string si existe
                            schemaName: schemaName || 'armonia', // Usar el schemaName proporcionado o 'armonia'
                        };
                    }
                    catch (error) {
                        ServerLogger.error('Error en la autorización de credenciales:', error);
                        return null;
                    }
                    finally {
                        if (schemaName) {
                            yield targetPrisma.$disconnect();
                        }
                    }
                });
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        jwt(_a) {
            return __awaiter(this, arguments, void 0, function* ({ token, user }) {
                if (user) {
                    // El usuario es el objeto devuelto por authorize
                    token.id = user.id;
                    token.email = user.email;
                    token.role = user.role;
                    token.name = user.name;
                    token.complexId = user.complexId;
                    token.schemaName = user.schemaName;
                }
                return token;
            });
        },
        session(_a) {
            return __awaiter(this, arguments, void 0, function* ({ session, token }) {
                // Enviar propiedades adicionales al cliente, como el ID de usuario y el rol
                if (token) {
                    session.user.id = token.id;
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.role = token.role;
                    session.user.complexId = token.complexId;
                    session.user.schemaName = token.schemaName;
                }
                return session;
            });
        },
    },
    pages: {
        signIn: '/login',
        error: '/login', // Redirigir a la página de login en caso de error
    },
    secret: process.env.NEXTAUTH_SECRET,
};
