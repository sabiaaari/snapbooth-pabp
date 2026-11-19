import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type VerificationTokenRecord = {
  identifier: string;
  token: string;
  expires: Date;
};

type VerificationTokenDelegate = {
  findUnique(args: { where: { token: string } }): Promise<VerificationTokenRecord | null>;
  delete(args: { where: { token: string } }): Promise<unknown>;
};

type UserDelegate = {
  update(args: {
    where: { email: string };
    data: { emailVerified: Date };
  }): Promise<unknown>;
};

const verificationTokens = (prisma as unknown as { verificationToken: VerificationTokenDelegate })
  .verificationToken;
const users = (prisma as unknown as { user: UserDelegate }).user;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token verifikasi tidak ditemukan." }, { status: 400 });
  }

  const record = await verificationTokens.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json(
      { error: "Tautan verifikasi tidak valid atau sudah kedaluwarsa." },
      { status: 400 }
    );
  }

  await users.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await verificationTokens.delete({
    where: { token },
  });

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?verified=true`);
}