import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "admin@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const client = await clientPromise;
        const db = client.db("ecommerce");
        const user = await db.collection("admins").findOne({ email });

        console.log("Znaleziony użytkownik:", user);

        if (!user) {
          console.log("Użytkownik nie istnieje w bazie");
          return null;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log("Czy hasło jest poprawne?", isPasswordValid);

        if (isPasswordValid) {
          return { id: user._id, email: user.email };
        } else {
          console.log("Błędne hasło");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
