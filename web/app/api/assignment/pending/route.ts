import { NextResponse } from 'next/server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const pendingAssignments = await db.assignment.findMany({
      where: {
        submissions: {
          none: {
            studentId: userId
          }
        },
        dueDate: {
          gte: new Date()
        }
      },
      include: {
        course: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    return NextResponse.json(pendingAssignments)
  } catch (error) {
    console.error("[PENDING_ASSIGNMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}