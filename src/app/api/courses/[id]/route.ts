import { NextRequest, NextResponse } from 'next/server'
import { Course, ensureCourseIndexes } from '@/lib/models/course'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { connectDB } from '@/lib/db'
import { requireAdminAPI } from '@/app/data/admin/require-admin-api'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        await ensureCourseIndexes()

        const { id } = await params
        const course = await Course.findById(id).lean()

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json(course)
    } catch (error) {
        console.error('Error fetching course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const sessionOrError = await requireAdminAPI()
        if (sessionOrError instanceof NextResponse) {
            return sessionOrError
        }

        const body = await request.json()

        await connectDB()
        await ensureCourseIndexes()

        const { id } = await params
        const course = await Course.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        )

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json(course)
    } catch (error) {
        console.error('Error updating course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const sessionOrError = await requireAdminAPI()
        if (sessionOrError instanceof NextResponse) {
            return sessionOrError
        }

        await connectDB()
        await ensureCourseIndexes()

        const { id } = await params
        const course = await Course.findByIdAndDelete(id)

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Course deleted successfully' })
    } catch (error) {
        console.error('Error deleting course:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}