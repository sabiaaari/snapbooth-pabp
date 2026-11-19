import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const userModel = (prisma as unknown as {
      user: {
        findUnique(args: { where: { email: string } }): Promise<unknown>;
        create(args: {
          data: { name: string; email: string; password: string };
        }): Promise<unknown>;
      };
    }).user;
    const existingUser = await userModel.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await (prisma as unknown as {
      verificationToken: {
        create(args: {
          data: { identifier: string; token: string; expires: Date };
        }): Promise<unknown>;
      };
    }).verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
      },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Registration successful! Please check your inbox or spam folder to verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the registration." },
      { status: 500 }
    );
  }
}