import { NextResponse } from 'next/server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const assignmentId = formData.get('assignmentId') as string
    const comments = formData.get('comments') as string
    const file = formData.get('file') as File

    // Get user profile for the student name
    const userProfile = await db.profile.findUnique({
      where: {
        userId: userId
      }
    })

    if (!userProfile) {
      return new NextResponse("User profile not found", { status: 404 })
    }

    // Here you would typically upload the file to a storage service
    const fileUrl = await uploadFile(file)

    const submission = await db.submission.create({
      data: {
        assignmentId,
        studentId: userId,
        studentName: userProfile.name,
        fileUrl,
        comments,
      },
      include: {
        assignment: true
      }
    })

    // Notify teacher (you'll need to implement this)
    await notifyTeacher(submission)

    return NextResponse.json(submission)
  } catch (error) {
    console.error("[SUBMISSIONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

function uploadFile(file: File) {
  throw new Error('Function not implemented.')
}
function notifyTeacher(submission: { id: string; createdAt: Date; updatedAt: Date; assignmentId: string; studentId: string; fileUrl: string; comments: string | null }) {
  throw new Error('Function not implemented.')
}

