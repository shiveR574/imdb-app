import { prisma } from '@src/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/src/lib/authOptions";

// GET /api/list?status=watched
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // optional filter

  const entries = await prisma.listEntry.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}), // only filter by status if provided
    },
    orderBy: { addedOn: 'desc' },
  })

  return Response.json(entries)
}

// POST /api/list  — add something to your list
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 401 })
  }

  const body = await request.json()
  const { mediaId, mediaType, status, note } = body

  // check if it already exists
    const existing = await prisma.listEntry.findUnique({
        where: {
            userId_mediaId: {
                userId: session.user.id,
                mediaId: String(mediaId),
            },
        },
    });
  if (existing) {
        return Response.json({ error: "Already in your list" }, { status: 409 });
    }
  
  const entry = await prisma.listEntry.create({
    data: {
      userId: session.user.id,
      mediaId,
      mediaType,
      status,
      note: note ?? null,
    },
  })

  return Response.json(entry, { status: 201 })
}