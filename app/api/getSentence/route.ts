import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const prismaClient = new PrismaClient();

  const sentences=await prismaClient.sentences.findMany({});
  const index=Math.floor(Math.random() * (sentences.length));
  return  NextResponse.json(sentences[index]);
}
