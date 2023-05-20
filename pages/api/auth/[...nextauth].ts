import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import prismadb from "../../../lib/prismadb";

import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Veuillez entrer une adresse e-mail et un mot de passe.');
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error('Nous n\'avons pas trouvé de compte avec cette adresse e-mail. Veuillez réessayer ou créez un nouveau compte.');
                }

                const isCorrectPassword = await compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error('Mot de passe incorrect');
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: '/auth',
    },
    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET
})