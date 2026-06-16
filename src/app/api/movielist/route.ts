import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/authOptions"; 
import { prisma } from "@/src/lib/prisma";

// ==========================================
// 1. POST: Handles Saving or Updating Status
// ==========================================
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { movieId, status, movieName } = await request.json();
    console.log("Received:", { movieId, status, movieName }); // add this line

    const watchlistItem = await prisma.watchlist.upsert({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: String(movieId), // Cast to string just to be safe
        },
      },
      update: { status, movieName: movieName || null }, // Update status and optionally movieName
      create: {
        userId: session.user.id,
        movieId: String(movieId),
        status: status,
        movieName: movieName || null,
        email: session.user.email || "", // Store email if available
      },
    });

    return NextResponse.json({ success: true, data: watchlistItem });
  } catch (error) {
    console.error("Database error during POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ==========================================
// 2. GET: Handles Fetching Existing Status
// ==========================================
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extracts URL parameters (e.g., /api/list?movieId=550)
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json({ error: "Missing movieId parameter" }, { status: 400 });
    }

    // Queries Supabase for an existing row matching this user + movie
    const watchlistItem = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: String(movieId),
        },
      },
    });

    // Returns the status string (e.g., "WATCHING") or null if they haven't saved it yet
    return NextResponse.json({ status: watchlistItem?.status || null });

  } catch (error) {
    console.error("Database error during GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}