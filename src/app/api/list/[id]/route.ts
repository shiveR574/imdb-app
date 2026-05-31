import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// PATCH /api/list/:id  — update status, rating, or note
export async function PATCH(request, { params }) {
  const session = await getServerSession()

  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 401 })
  }

  const body = await request.json()

  // make sure the entry belongs to this user before updating
  const existing = await prisma.listEntry.findUnique({
    where: { id: params.id },
  })

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.listEntry.update({
    where: { id: params.id },
    data: {
      status: body.status ?? existing.status,
      rating: body.rating ?? existing.rating,
      note: body.note ?? existing.note,
      watchedOn: body.status === 'watched' ? new Date() : existing.watchedOn,
    },
  })

  return Response.json(updated)
}

// DELETE /api/list/:id  — remove from list
export async function DELETE(request, { params }) {
  const session = await getServerSession()

  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 401 })
  }

  const existing = await prisma.listEntry.findUnique({
    where: { id: params.id },
  })

  if (!existing || existing.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.listEntry.delete({
    where: { id: params.id },
  })

  return Response.json({ success: true })
}