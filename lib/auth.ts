import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import connectToDB from './mongodb';
import User from '@/models/User';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDB();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.userName,
            image: user.profilePicture,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectToDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = new User({
              email: user.email,
              userName: user.name || user.email?.split('@')[0],
              profilePicture: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
              createdAt: new Date(),
              lastActive: new Date(),
            });
            
            await newUser.save();
            user.id = newUser._id.toString();
          } else {
            user.id = existingUser._id.toString();
            // Update last active
            await User.findByIdAndUpdate(existingUser._id, {
              lastActive: new Date()
            });
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  secret: process.env.NEXTAUTH_SECRET,
};