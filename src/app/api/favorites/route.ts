// app/api/favorites/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/authOptions";
import { prisma } from "@/src/lib/prisma";
import { FavoriteType } from "@/src/types/favorite";

const VALID_TYPES = ["MOVIE", "TVSHOW", "PERSON"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, entityId, entityName } = await request.json();

    if (!type || !entityId) {
      return NextResponse.json({ error: "Missing type or entityId" }, { status: 400 });
    }

    // validação adicionada aqui
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_type_entityId: {
          userId: session.user.id,
          type: type as FavoriteType,
          entityId: String(entityId),
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, favorited: false });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        email: session.user.email || "",
        type: type as FavoriteType,
        entityId: String(entityId),
        entityName: entityName || null,
      },
    });

    return NextResponse.json({ success: true, favorited: true, data: favorite });
  } catch (error) {
    console.error("Database error during POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const entityId = searchParams.get("entityId");

    if (!type || !entityId) {
      return NextResponse.json({ error: "Missing type or entityId parameter" }, { status: 400 });
    }

    // validação adicionada aqui
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_type_entityId: {
          userId: session.user.id,
          type: type as FavoriteType,
          entityId: String(entityId),
        },
      },
    });

    return NextResponse.json({ favorited: !!favorite });

  } catch (error) {
    console.error("Database error during GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}