import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export function GET(req, res) {
  return handler(req, res);
}

export function POST(req, res) {
  return handler(req, res);
}
