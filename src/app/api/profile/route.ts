import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, company, bio } = await req.json();

    const updated = await db.user.update({
      where: { email: session.user.email },
      data: { name, email, company, bio },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      company: updated.company,
      bio: updated.bio,
      image: updated.image,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
