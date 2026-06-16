import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/authOptions";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tvshowId, status, tvshowName } = await request.json();

    const watchlistItem = await prisma.tvShowWatchlist.upsert({
      where: {
        userId_tvshowId: {
          userId: session.user.id,
          tvshowId: String(tvshowId),
        },
      },
      update: { status, tvshowName: tvshowName || null },
      create: {
        userId: session.user.id,
        tvshowId: String(tvshowId),
        status: status,
        tvshowName: tvshowName || null,
        email: session.user.email || "",
      },
    });

    return NextResponse.json({ success: true, data: watchlistItem });
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
    const tvshowId = searchParams.get("tvshowId");

    if (!tvshowId) {
      return NextResponse.json({ error: "Missing tvshowId parameter" }, { status: 400 });
    }

    const watchlistItem = await prisma.tvShowWatchlist.findUnique({
      where: {
        userId_tvshowId: {
          userId: session.user.id,
          tvshowId: String(tvshowId),
        },
      },
    });

    return NextResponse.json({ status: watchlistItem?.status || null });

  } catch (error) {
    console.error("Database error during GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}